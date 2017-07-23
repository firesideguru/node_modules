<?php

/******************************************
 *** PARSER LOGIC AND ALL CODE CREATED BY *
 *** Kevin Douglas <kdouglas@satarah.com> *
 *** Copyright (C) 2011, Kevin A. Douglas *
 ******************************************/

// NODE STATE CONSTANTS -- looks like ...
self::NODE_OPEN;   // < (enter) <node> (leave)
self::NODE_CLOSE;  // </ (enter) </node> (leave)
self::NODE_SINGLE; // <node /> (leave, enters as NODE_OPEN) // NODE_VOID NODE_EMPTY
self::NODE_CDATA;  // <![CDATA[ (raw unexpanded character data) ]]>
self::NODE_COMM;   // <!-- (raw unexpanded comment data) -->
self::NODE_PINST;  // <?target (processing instructions) ? > (no gap)
self::NODE_ENTITY; // <!ENTITY (DOCTYPE, REFERENCE, NOTATION)>
self::NODE_TEXT;   // ... (plain content between nodes)
self::NODE_BASE;   // document wrapper node

function parse ($source) // (STRING) :FATAL on error
{
	// LOCAL VARIABLES AND NOTES
	$len = strlen($source); // (INT)
	$pos = -1;     // (INT) string pointer position
	$char = NULL;  // (CHAR) current character being parsed
	$node = NULL;  // (BOOL) in a node (else in character data content)
	$state = NULL; // (CONST) node states (NODE_OPEN, NODE_CLOSE, ...)
	
	while (++ $pos < $len) // FOR EVERY CHARACTER
	{
		// get character
		$char = $source[$pos];

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
					break;
				}
				case '?':
				{
					$state = self::NODE_PINST;
					$pos ++;
					break;
				}
				case '!':
				{
					if (substr($source, $pos + 2, 7) == '[CDATA[')
					{
						$state = self::NODE_CDATA;
						$pos += 8;
					}
					elseif (substr($source, $pos + 2, 2) == '--')
					{
						$state = self::NODE_COMM;
						$pos += 3;
					}
					else
					{
						$state = self::NODE_ENTITY;
						$pos ++;
					}
					break;
				}
			}
			if ($node && $this->data)
			{
				// WE ENTERED NODE, SEND CONTENT DATA
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
						$node = TRUE; // RESET, FALSE ALARM
						$this->data .= $char;
					}
				}
			}
			if (!$node) // WE LEFT NODE, SEND IT
			{
				$this->send($state);
			}
		}
		// RECORD DATA
		else
		{
			$this->data .= $char;
		}
	} // end of while loop
	// FINISHED PARSING SOURCE
}

?>