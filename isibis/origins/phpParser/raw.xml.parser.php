<?php

/*** NOTES ***
!IMPORTANT -- strip CDATA tags when compiling <html>

For the love of god -- turn off magic_quotes_gpc!
otherwise must include .htaccess or php.ini files

This is not perfect in its error detection
Ex: nodename="value" is not an error state
Ex: <xml is a reserved node name, but :-/!
... I can expand detection later if needed

Online References:
INTRO:		http://www.xml.com/pub/a/98/10/guide0.html?page=3
NAMING:		http://www.featureblend.com/xml-element-naming.html
ENTITY:		http://www.xml.com/pub/a/98/08/xmlqna0.html?page=2#ENTATTR
PINST:		http://www.javacommerce.com/displaypage.jsp?name=pi.sql&id=18238
TYPE:		http://www.w3schools.com/dom/dom_nodetype.asp
SGML:		http://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.4
EXPAND PI:	http://php.net/manual/en/example.xml-external-entity.php

Cdata Caution:
Don't be confused by basic parsed out $cdata content Ex: <node>character data</node>
and the parser in the $state of 'CDATA' Ex: <![CDATA[ section data ]]>
...the first is outside of (!$node) and detects ENTER_NODE Ex: <node> ...
...the second is node data $ndata ($node) and detects LEAVE_NODE Ex: <...>

With CDATA and COMM sections we do not expand tokens/symbols, just record raw chars
With PINST and ENTITY sections we pull the $name out and the rest is raw data chars
 
** PARSE SOURCE FROM STREAM NOT JUST STRING 
** SPLIT COMPLEMENT (pair, partner, match, other, spouse, twin, part, open|close)

	DOCTYPE can have nested ENTITY nodes ... must fix this in parser
	charset interoperability, entity expansion, case folding, comment expansion -- ini
	stream based input, stream or struct based output (callback)
	while (true) || while (++ $pos < $len && !$this->error) ... does not force EXIT
	do not force end of tree unless $final BOOL sent, continues to parse stream ...
	serialization, caching, direct serialization to file, ... persistance, reuse
	vs. once-off parsing for datawarehousing and template processing (in sequence)

***/

// DEVELOPMENT REPORTING
error_reporting(E_ALL);
ini_set("display_errors", 1);

class XMLParser
{
	// PUBLIC MEMBERS
	public $nodes;				// (ARRAY) nodes object collection 			-- main result
	public $trace;				// (ARRAY) nodes-index tree (child nodes)	-- main result
	public $error;				// (STRING) did we encounter a parse error
	// GLOBAL PROPERTIES
	protected $stack;			// (ARRAY) track nesting depth and split <node>...</node> names
	protected $data;			// (STRING) stored node and content data
	protected $row;				// (INT) current line in source code
	protected $col;				// (INT) current character of line (column)
	// EXIT CODE CONSTANTS		-- arbitrary values
	const ERROR_NEST	= 1;	// <div><para>...</div></para>
	const ERROR_NODE	= 2;	// <para<div>... (or) <n<ode ...
	const ERROR_NAME	= 3;	// <(not a-zA-Z)\b
	const ERROR_RESV	= 4;	// <xml
	const ERROR_FRAG	= 5; 	// <node> outside of root
	const ERROR_TREE	= 6;	// unclosed root node tree -- NOT IMPLEMENTED YET
	// NODE STATE CONSTANTS		-- arbitrary values
	const NODE_OPEN		= 1;	// < (enter) <node> (leave)
	const NODE_CLOSE	= 2;	// </ (enter) </node> (leave) 
	const NODE_SINGLE	= 3;	// <node /> (leave, starts as OPEN)
	const NODE_CDATA	= 6;	// <![CDATA[ (raw unexpanded character data) ]]>
	const NODE_COMM		= 7;	// <!-- (raw unexpanded comment data) -->
	const NODE_PINST	= 8;	// <?target (processing instructions) ? > (no gap)
	const NODE_ENTITY	= 9;	// <!ENTITY (DOCTYPE, REFERENCE, NOTATION)>
	const NODE_TEXT		= 10;	// ...
	const NODE_BASE		= 11;	// document wrapper node // NODE_FLOOR FILE ROOT
	// NODE CONTENT CONSTANTS 	-- arbitrary values
	const FLAG_EMPTY	= 1;	// <node></node> // STUMP BARREN
	const FLAG_ENTIRE	= 2;	// <node>...</node>
	const FLAG_PARTED	= 3;	// <node>...<node />...</node>
//	const FLAG_INLINE	= 4;	// <!node ... > (or) ...
	
	public function __construct ()
	{
		$this->data = NULL;
		$this->error = NULL;
		$this->nodes = array();
		$this->trace = array();
		$this->stack = array();
		$this->send(self::NODE_BASE);
	}
	
	// MAIN METHOD
	public function parse ($source, $final = FALSE) // (STRING) :FATAL on error
	{
		// LOCAL VARIABLES AND NOTES
		$len = strlen($source);	// (INT)
		$pos = -1;		// (INT) string pointer position
		$row = 1;		// (INT) current line number
		$col = 0;		// (INT) current character column
		$char = NULL;	// (CHAR) current character being parsed
		$node = NULL;	// (BOOL) in a node (else in character data [cdata]) ?
		$tree = NULL;	// (BOOL) we've entered the xml node tree (ignore root level entities) ?
		$state = NULL;	// (CONST) node states (OPEN, CLOSE, SINGLE, ...) 
		
		while (++ $pos < $len && !$this->error)
		{
			// FOR EVERY CHARACTER
			$char = $source[$pos];
			
			// COUNT LINES
			switch ($char)
			{
				case "\r":
					$row ++;
					$col = 0;
				break;
				case "\n":
					if ($pos && $source[$pos - 1] == "\r") break; // \r\n seq. DOS
					$row ++;
					$col = 0;
				break;
				default:
					$col ++;
				break;
			}
			
			// UPDATE GLOBALS
			$this->row = $row;
			$this->col = $col;
						
			// IN CONTENT DATA, TEST FOR NODE-ENTER
			if (!$node && $char == '<')
			{
				// defaults assumed ...
				$state = self::NODE_OPEN;
				$node = TRUE;
				switch ($source[$pos + 1]) // next char
				{
					case '/':
					{
						$state = self::NODE_CLOSE;
						$pos ++; // skip next char '/'
						$col ++; // update column pos
						break;
					}
					case '?':
					{
						$state = self::NODE_PINST;
						$pos ++;
						$col ++;
						break;
					}
					case '!':
					{
						if (substr($source, $pos + 2, 7) == '[CDATA[')
						{
							$state = self::NODE_CDATA;
							$pos += 8;
							$col += 8;
						}
						elseif (substr($source, $pos + 2, 2) == '--')
						{
							$state = self::NODE_COMM;
							$pos += 3;
							$col += 3;
						}
						else
						{
							$state = self::NODE_ENTITY;
							$pos ++;
							$col ++;
						}
						break;
					}
					default:
					{
						if ($tree) // ini parse frags ?
						{
							// test for if out of bounds of root node, on ELEMENT nodes only
							if (count($this->stack) < 1) $this->status(self::ERROR_FRAG); // fragment
						}
						else // welcome to the machine, um, root node tree
						{
							$tree = TRUE;
						}
					}
				}
				if ($node && $this->data)
				{
					// we entered node, send content data
					$this->send(self::NODE_TEXT);
				}
			}
			// IN NODE DATA, TEST FOR NODE-LEAVE
			elseif ($node && $char == '>')
			{
				$node = FALSE;
				switch ($state)
				{
					case self::NODE_OPEN:
					{
						if ($source[$pos - 1] == '/')
						{
							$state = self::NODE_SINGLE;
							$this->data = rtrim($this->data, ' /');
						}
						break;
					}
					case self::NODE_CLOSE: // required
					{
						break;
					}
					case self::NODE_ENTITY: // required
					{
						break;
					}
					default: // we do not expand '>' token in these types ...
					{
						if ($state == self::NODE_PINST && $source[$pos - 1] == '?')
						{
							$this->data = rtrim($this->data, '?');
						}
						elseif ($state == self::NODE_COMM && substr($source, $pos - 2, 2) == '--')
						{
							$this->data = rtrim($this->data, '-');
						}
						elseif ($state == self::NODE_CDATA && substr($source, $pos - 2, 2) == ']]')
						{
							$this->data = rtrim($this->data, ']');
						}
						else
						{
							$node = TRUE; // reset, false alarm
							$this->data .= $char;
						}
					}
				}
				if (!$node) // we left node, send it
				{
					$this->send($state);
				}
			}
			// NODE NESTING FATAL ERROR
			elseif ($node && $char == '<')
			{
				// DOCTYPE ENTITY nodes can contain nested ENTITY nodes ... FIX HERE?
				// DOCTYPE COMMENTS open and close with interspersed (--) ... FIX LATER?
				if ($state == self::NODE_OPEN || $state == self::NODE_CLOSE || 
					$state == self::NODE_ENTITY) $this->status(self::ERROR_NODE);
				$this->data .= $char;
			}
			// RECORD DATA
			else
			{
				$this->data .= $char;
			}
		}
		return ($this->error) ? FALSE : TRUE; // exit status
	}
	
	// CONSTRUCT NODE OBJECT TREE
	protected function send ($state)
	{
		$node = new stdClass;
		$node->state = $state;
		$node->data = $this->data;		// temp variable
		$index = count($this->nodes);	// next node-ID
		$depth = count($this->stack);	// nesting level
		$trunk = ($depth) ? end($this->stack) : NULL; // parent
		$trace = NULL; // children ?
		switch ($state)
		{
			case self::NODE_BASE: // no name, no value, no attrs, no parent, has chidren
			{
				$this->stack[] = $index; // document node container
				$trace = $index;
				break;
			}
			case self::NODE_OPEN: // has name, no value, possibly attrs, possibly children
			{
				$this->name($node);
				$this->attrs($node);
				$this->stack[] = $index;
				$trace = $index;
				break;
			}
			case self::NODE_CLOSE: // has name, no value, no attrs, no children
			{
				$this->name($node);
				$idx = array_pop($this->stack);
				if ($node->name != $this->nodes[$idx]->name)
				{
					$this->status(self::ERROR_NEST);
				}
				$this->flagit($this->nodes[$idx]);
				// open-close split complements ...
				$this->nodes[$idx]->split = $index;
				$node->split = $idx;
				$depth = count($this->stack);
				$trunk = end($this->stack);
				break;
			}
			case self::NODE_SINGLE: // has name, no value, possibly attrs, no children
			{
				$this->name($node);
				$this->attrs($node);
				//$depth ++;
				break;
			}
			case self::NODE_PINST: // has name (target) + raw value, possibly attrs, no children
			{
				$this->name($node);
				$this->attrs($node);
				$node->value = $this->data;
				//$depth ++;
				break;
			}
			case self::NODE_ENTITY: // has name (type) + raw value, no children
			{
				$this->name($node);
				$node->value = $this->data;
				//$depth ++;
				break;
			}
			case self::NODE_COMM: // no name, raw value (expand on ini directive -- recursive), no children
			{
				$node->value = $this->data;
				//$depth ++;
				break;
			}
			case self::NODE_CDATA: // no name, raw value, no children
			{
				$node->value = $this->data;
				break;
			}
			case self::NODE_TEXT: // no name, expanded cdata (during parse), no children
			{
				if (!$this->data) return;
				$node->value = $this->data;
				break;
			}
		}
		if (!is_null($trunk)) $this->trace[$trunk][] = $index;
		if (!is_null($trunk)) $node->trunk = $trunk;
		if (!is_null($trace)) $node->trace = $trace;
		$node->index = $index; // nodes[] self ID
		$node->depth = $depth;
		unset($node->data);
		$this->data = NULL;
		$this->nodes[] = $node;
	}
	
	protected function name (&$node)
	{
		$pass = preg_match("/^([a-z]\S*)\s*(.*)$/is", $node->data, $match);
		if (!$pass) $this->status(self::ERROR_NAME);
		$node->name = $match[1];
		$node->data = $match[2];
		$node->name = strtoupper($node->name); // case-folding
	}

	protected function attrs (&$node) // must call following $this->name($node)
	{
		// xml standard requires all attributes to be quoted
		// I allow unquoted attributes with no white space
		// but do not allow for single-quoted attributes
		if (is_null($node->data)) return;
		$attrs = array();
		$regex = '/^([a-z][\w-]*)\s*=\s*(".+?"|\S+)\s*(.*)$/is';
		while (preg_match($regex, $node->data, $match))
		{
			$attrs[$match[1]] = trim($match[2], '"');
			$node->data = $match[3];
		}
		$node->attrs = (count($attrs)) ? (object) $attrs : NULL;
	}

	protected function flagit (&$node)
	{
		if (!isset($node->trace)) return;
		if (isset($this->trace[$node->trace]))
		{
			$trace = $this->trace[$node->trace];
			$count = count($trace);
			if ($count)
			{
				if ($count == 1)
				{
					$state = $this->nodes[end($trace)]->state;
					if ($state == self::NODE_TEXT || $state == self::NODE_COMM || $state == self::NODE_CDATA)
					{
						$node->flag = self::FLAG_ENTIRE; // has one content child
					}
					else
					{
						$node->flag = self::FLAG_PARTED; // has one element child
					}
				}
				else
				{
					$node->flag = self::FLAG_PARTED; // has multiple children
				}
			}
		}
		if (!isset($node->flag))
		{
			unset($node->trace);
			$node->flag = self::FLAG_EMPTY; // has no children 
		}
	}
	
	protected function status ($code = NULL)
	{
		switch ($code)
		{
			case self::ERROR_NODE:
			{
				$msg = 'Error: Illegal character "<" in node data';
				break;
			}
			case self::ERROR_NEST:
			{
				$msg = 'Error: Mismatched node names or case';
				break;
			}
			case self::ERROR_NAME:
			{
				$msg = "Error: Xml element names must start with a letter";
				break;
			}
			case self::ERROR_RESV:
			{
				$msg = "Error: XML is a reserved element name";
				break;
			}
			case self::ERROR_FRAG:
			{
				$msg = "Error: Non-entity nodes found outside of root";
				break;
			}
			case self::ERROR_TREE:
			{
				$msg = "Error: Incomplete document tree structure";
				break;
			}
			default:
			{
				$msg = "Parsed No Errors";
			}
		}
		if ($code) $this->error = (object) array('string' => $msg, 'code' => $code, 'line' => $this->row, 'column' => $this->col);
	}
}

?>