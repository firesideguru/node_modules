<?php

// DEVELOPMENT REPORTING
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once('raw.xml.parser.php');

class DOMParser extends XMLParser
{
	// NODE TYPE CONSTANTS 		-- derived from DOM standard
	const DOM_ELEMENT	= 1;
	const DOM_ATTRIBUTE	= 2;	// NOT IMPLEMENTED YET
	const DOM_CONTENT	= 3;
	const DOM_CSECTION	= 4;
	const DOM_REFERENCE	= 5;
	const DOM_ENTITY	= 6;
	const DOM_INSTRUCT	= 7;
	const DOM_COMMENT	= 8;
	const DOM_DOCUMENT	= 9;
	const DOM_DOCTYPE	= 10;
	const DOM_FRAGMENT	= 11;	// NOT IMPLEMENTED YET
	const DOM_NOTATION	= 12;

	// CONVENIENCE METHOD FOR USER
	public function getStateString ($node)
	{
		$state = (is_int($node)) ? $node : $node->state;
		switch ($state)
		{
			case self::NODE_OPEN:	return 'NODE_OPEN';
			case self::NODE_CLOSE:	return 'NODE_CLOSE';
			case self::NODE_SINGLE:	return 'NODE_SINGLE';
			case self::NODE_CDATA:	return 'NODE_CDATA';
			case self::NODE_COMM:	return 'NODE_COMM';
			case self::NODE_PINST:	return 'NODE_PINST';
			case self::NODE_ENTITY:	return 'NODE_ENTITY';
			case self::NODE_TEXT:	return 'NODE_TEXT';
			case self::NODE_BASE:	return 'NODE_BASE';
			default:				return NULL;
		}
	}
	
	// CONVENIENCE METHOD FOR USER
	public function getFlagString ($node)
	{
		$flag = (is_int($node)) ? $node : $node->flag;
		switch ($flag)
		{
			case self::FLAG_EMPTY:	return 'FLAG_EMPTY';
			case self::FLAG_ENTIRE:	return 'FLAG_ENTIRE';
			case self::FLAG_PARTED:	return 'FLAG_PARTED';
			case self::FLAG_INLINE:	return 'FLAG_INLINE';
			default:				return NULL;
		}
	}
	
	// CONVENIENCE METHOD FOR USER
	public function getTypeString ($node)
	{
		$type = (is_int($node)) ? $node : $node->type;
		switch ($type)
		{
			case self::DOM_ELEMENT:		return 'DOM_ELEMENT';
			case self::DOM_ATTRIBUTE:	return 'DOM_ATTRIBUTE';
			case self::DOM_CONTENT:		return 'DOM_CONTENT';
			case self::DOM_CSECTION:	return 'DOM_CSECTION';
			case self::DOM_REFERENCE:	return 'DOM_REFERENCE';
			case self::DOM_ENTITY:		return 'DOM_ENTITY';
			case self::DOM_INSTRUCT:	return 'DOM_INSTRUCT';
			case self::DOM_COMMENT:		return 'DOM_COMMENT';
			case self::DOM_DOCUMENT:	return 'DOM_DOCUMENT';
			case self::DOM_DOCTYPE:		return 'DOM_DOCTYPE';
			case self::DOM_FRAGMENT:	return 'DOM_FRAGMENT';
			case self::DOM_NOTATION:	return 'DOM_NOTATION';
			default:					return NULL;
		}
	}
	
	// CONVENIENCE METHOD FOR USER
	public function getParentId ($node)
	{
		$index = (is_int($node)) ? $node : $node->index;
		return $this->nodes[$index]->trunk;
	}
	
	// CONVENIENCE METHOD FOR USER
	public function getParentNode ($node)
	{
		$index = (is_int($node)) ? $node : $node->index;
		if ($node->trunk)
		{
			$parent = &$nodes[$node->trunk];
		}
		return ($node->trunk) ? $trunk : NULL;
	}
	
	// CONVENIENCE METHOD FOR USER
	public function getChildIds ($node)
	{
		if (!is_object($node)) return NULL;
		if (!isset($node->trace)) return NULL;
		return $this->trace[$node->trace];
	}
	
	// CONVENIENCE METHOD FOR USER
	public function getChildNodes ($node)
	{
		$index = (is_int($node)) ? $node : $node->index;
		$children = array();
		if (!is_null($node->children))
		{
			foreach ($trace[$node->children] as $child)
			{
				$children[] = &$nodes[$child];
			}
		}
		return $children;
	}
	
	// CONSTRUCT NODE OBJECT TREE -- EXTENDED
	protected function send ($state)
	{
		$node = new stdClass;
		$node->state = $state;
		$node->data = $this->data;		// temp variable
		$index = count($this->nodes);	// next node-ID
		$depth = count($this->stack);	// nesting level
		$trunk = ($depth) ? end($this->stack) : NULL;
		$trace = NULL;
		switch ($state)
		{
			case self::NODE_BASE: // no name, no value, no attrs, no parent, has chidren
			{
				$node->type = self::DOM_DOCUMENT;
				$this->domit($node);
				$this->stack[] = $index;
				$trace = $index;
				break;
			}
			case self::NODE_OPEN: // has name, no value, possibly attrs, possibly children
			{
				$node->type = self::DOM_ELEMENT;
				$this->name($node);
				$this->attrs($node);
				$this->stack[] = $index;
				$trace = $index;
				break;
			}
			case self::NODE_CLOSE: // has name, no value, no attrs, no children
			{
				$node->type = self::DOM_ELEMENT;
				$this->name($node);
				$idx = array_pop($this->stack);
				if ($node->name != $this->nodes[$idx]->name)
				{
					$this->status(self::ERROR_NEST);
				}
				$this->flagit($this->nodes[$idx]);
				$this->nodes[$idx]->split = $index;
				$node->split = $idx;
				$depth = count($this->stack);
				$trunk = end($this->stack);
				break;
			}
			case self::NODE_SINGLE: // has name, no value, possibly attrs, no children
			{
				$node->type = self::DOM_ELEMENT;
				$this->name($node);
				$this->attrs($node);
				//$depth ++;
				break;
			}
			case self::NODE_PINST: // has name (target) + raw value, possibly attrs, no children
			{
				$node->type = self::DOM_INSTRUCT;
				$this->name($node);
				$this->attrs($node);
				$node->value = $this->data;
				//$depth ++;
				break;
			}
			case self::NODE_ENTITY: // has name (type) + raw value, no children
			{
				$node->type = self::DOM_ENTITY;
				$this->name($node);
				$this->entype($node);
				$node->value = $this->data;
				//$depth ++;
				break;
			}
			case self::NODE_COMM: // no name, raw value (expand on ini directive -- recursive), no children
			{
				$node->type = self::DOM_COMMENT;
				$this->domit($node); // name
				$node->value = $this->data;
				//$depth ++;
				break;
			}
			case self::NODE_CDATA: // no name, raw value, no children
			{
				$node->type = self::DOM_CSECTION;
				$this->domit($node); // name
				$node->value = $this->data;
				break;
			}
			case self::NODE_TEXT: // no name, expanded cdata (in parser), no children
			{
				if (!$this->data) return;
				$node->type = self::DOM_CONTENT;
				$this->domit($node);
				$node->value = $this->data;
				break;
			}
		}
		if (!is_null($trunk)) $this->trace[$trunk][] = $index;
		if (!is_null($trace)) $node->trace = $trace;
		if (!is_null($trunk)) $node->trunk = $trunk;
		$node->index = $index; // self nodes[] ID
		$node->depth = $depth;
		unset($node->data);
		$this->data = NULL;
		$this->nodes[] = $node;
	}
	
	protected function domit (&$node)
	{
		switch ($node->type) // cases 1..12
		{
			case self::DOM_ELEMENT:		break;	// {element_name}
			case self::DOM_ATTRIBUTE:	break;	// {attribute_name}
			case self::DOM_CONTENT:		$node->name = "#text"; break;
			case self::DOM_CSECTION:	$node->name = "#cdata-section"; break;
			case self::DOM_REFERENCE:	break;	// {entity_reference_name}
			case self::DOM_ENTITY:		break;	// {entity_name}
			case self::DOM_INSTRUCT:	break;	// {target}
			case self::DOM_COMMENT:		$node->name = "#comment"; break;
			case self::DOM_DOCUMENT:	$node->name = "#document"; break;
			case self::DOM_DOCTYPE:		break;	// {doctype_name}
			case self::DOM_FRAGMENT:	$node->name = "#document fragment"; break;
			case self::DOM_NOTATION:	break;	// {notation_name}
		}
	}
	
	protected function entype (&$node)
	{
		switch (strtoupper($node->name))
		{
			case 'ENTITY':		$node->type = self::DOM_ENTITY; break;
			case 'DOCTYPE':		$node->type = self::DOM_DOCTYPE; break;
			case 'NOTATION':	$node->type = self::DOM_NOTATION; break;
			case 'REFERENCE':	$node->type = self::DOM_REFERENCE; break;
			default:			$node->type = self::DOM_ENTITY; break;
		}
	}
}

?>