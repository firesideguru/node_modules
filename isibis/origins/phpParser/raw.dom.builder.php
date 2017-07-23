<?php

// DEVELOPMENT REPORTING
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once('raw.dom.parser.php'); // require_once('raw.xml.parser.php');

class DOMBuilder extends DOMParser // extends XMLParser (compatible)
{
	// BUILD DOCUMENT SOURCE
	// we can get fancier with formatting white space
	public function build ()
	{
		$enter = array();
		$enter[self::NODE_OPEN]		= '<';
		$enter[self::NODE_CLOSE]	= '</';
		$enter[self::NODE_SINGLE]	= '<';
		$enter[self::NODE_CDATA]	= '';
		$enter[self::NODE_COMM]		= '<!--';
		$enter[self::NODE_PINST]	= '<?';
		$enter[self::NODE_ENTITY]	= '<!';
		$enter[self::NODE_TEXT]		= '';
		$enter[self::NODE_BASE]		= '';
		$leave = array();
		$leave[self::NODE_OPEN]		= '>';
		$leave[self::NODE_CLOSE]	= '>';
		$leave[self::NODE_SINGLE]	= ' />';
		$leave[self::NODE_CDATA]	= '';
		$leave[self::NODE_COMM]		= '-->';
		$leave[self::NODE_PINST]	= '?>';
		$leave[self::NODE_ENTITY]	= '>';
		$leave[self::NODE_TEXT]		= '';
		$leave[self::NODE_BASE]		= '';
		$calls = array();
		$calls[self::NODE_OPEN]		= array('enter', 'name', 'attrs', 'leave');
		$calls[self::NODE_CLOSE]	= array('enter', 'name', 'leave');
		$calls[self::NODE_SINGLE]	= array('enter', 'name', 'attrs', 'leave');
		$calls[self::NODE_CDATA]	= array('value', 'leave');
		$calls[self::NODE_COMM]		= array('enter', 'value', 'leave');
		$calls[self::NODE_PINST]	= array('enter', 'value', 'leave'); // name attrs vs value
		$calls[self::NODE_ENTITY]	= array('enter', 'value', 'leave'); // name
		$calls[self::NODE_TEXT]		= array('value');
		$calls[self::NODE_BASE]		= array();
		$source = '';
		foreach ($this->nodes as $node)
		{
			$src = '';
			$state = $node->state;
			foreach ($calls[$state] as $call)
			{
				switch ($call)
				{
					case 'enter':
					{
						$indent = $node->depth - 3;
						$indent = ($indent > 0) ? $indent : 0;
						if ($node->state == self::NODE_CLOSE)
						{
							$split = $this->nodes[$node->split];
							if (isset($split->flag) && $split->flag == self::FLAG_PARTED)
							{
								$src = str_repeat("\t", $indent).$src;
							}
						}
						else
						{
							$src = str_repeat("\t", $indent).$src;
						}
						$src .= $enter[$state];
						break;
					}
					case 'name':
					{
						if (!isset($node->name)) break;
						if ($state != self::NODE_ENTITY) $node->name = strtolower($node->name);
						$src .= $node->name;
						break;
					}
					case 'attrs':
					{
						if (!isset($node->attrs)) break;
						foreach ($node->attrs as $name => $value)
						{
							$src .= " $name=\"$value\"";
						}
						break;
					}
					case 'value':
					{
						if (!isset($node->value)) break;
						$src .= trim($node->value);
						break;
					}
					case 'leave':
					{
						$src .= $leave[$state];
						if ($node->state == self::NODE_OPEN)
						{
							if (isset($node->flag) && $node->flag == self::FLAG_PARTED)
							{
								$src .= "\n";
							}
						}
						else
						{
							$src .= "\n";
						}
						break;
					}
				}
			}
			$source .= $src;
		}
		return $source;
	}
}

?>