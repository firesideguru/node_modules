<?php

// DEVELOPMENT REPORTING
error_reporting(E_ALL);
ini_set("display_errors", 1);

// ---------------- REQUEST ROUTINES ---------------- //

$file = $href = $text = $error = '';
$rfileck = $rhrefck = $rtextck = '';
$doxml = $dodom = $dosrc = NULL;
if (isset($_POST['submit']))
{
	$labels = array('file' => 'From File', 'href' => 'From URL', 'text' => 'From String');
	$doxml = (isset($_POST['xml'])) ? TRUE: FALSE;
	$dodom = (isset($_POST['dom'])) ? TRUE: FALSE;
	$dosrc = (isset($_POST['src'])) ? TRUE: FALSE;
	if (isset($_POST['parse']))
	{
		$parse = $_POST['parse'];
		switch ($parse)
		{
			case 'file':
			{
				$file = $_FILES['file']['tmp_name'];
				$rfileck = ' checked';
				if (empty($file))
				{
					$label = $labels[$parse];
					$error = $error = "You chose <em>$label</em> as your source but it has no value.";
					break;
				}
				$source = file_get_contents($file);
				break;
			}
			case 'href':
			{
				$href = $_POST[$parse];
				$rhrefck = ' checked';
				if (empty($href))
				{
					$label = $labels[$parse];
					$error = $error = "You chose <em>$label</em> as your source but it has no value.";
					break;
				}
				$source = file_get_contents($href);
				break;
			}
			case 'text':
			{
				$text = $_POST[$parse];
				$rtextck = ' checked';
				if (empty($text))
				{
					$label = $labels[$parse];
					$error = $error = "You chose <em>$label</em> as your source but it has no value.";
					break;
				}
				$source = $text;
				break;
			}
			default:
			{
				// should never be called
				$error = "We had an error determining the parse source field type.";
				break;
			}
		}
	}
	else
	{
		$opts = implode(", ", $labels);
		$error = "You must select a parsing option: <em>$opts</em>.";
	}
}

// ---------------- PARSING ROUTINES ---------------- //

require_once('raw.xml.parser.php');
require_once('raw.dom.parser.php');
require_once('raw.dom.builder.php');

//$source = file_get_contents('template.html');

if (isset($doxml)) $xml = @parseXML($source);
if (isset($dodom)) $dom = @parseDOM($source);
if (isset($dosrc)) $src = @buildDOM($source);

// testing and development
function parseXML ($source)
{
	$parser = new XMLParser;
	$parser->parse($source);
	if (isset($parser->error))
	{
		$error = "{$parser->error->string} ({$parser->error->code}) :: ";
		$error .= "Line: {$parser->error->line} :: Column: {$parser->error->column}";
		$parser->error = $error;
	}
	foreach ($parser->nodes as $node)
	{
		foreach ($node as $name => &$value)
		{
			switch ($name)
			{
				case 'flag':
				{
					$value = "$value\t\t[NODE FLAG]";
					break;
				}
				case 'state':
				{
					$value = "$value\t[NODE STATE]";
					break;
				}
				case 'value':
				{
					$value = "|$value|"; // easier to read |white space|
					break;
				}
				case 'depth':
				{
					$value = "$value\t[NODE NESTING]";
					break;
				}
				case 'index':
				{
					$value = "$value\t[NODE INDEX]";
					break;
				}
				case 'trunk':
				{
					$value = "$value\t[PARENT INDEX]";
					break;
				}
				case 'trace':
				{
					$value = "$value\t[CHILD LIST]";
					break;
				}
				case 'split':
				{
					$value = "$value\t[COMPLEMENT]";
					break;
				}
			}
			if (is_null($value)) $value = 'NULL'; // easier to read NULL
		}
	}
	return $parser;	
}

// testing and development
function parseDOM ($source)
{
	$parser = new DOMParser;
	$parser->parse($source);
	if (isset($parser->error))
	{
		$error = "{$parser->error->string} ({$parser->error->code}) :: ";
		$error .= "Line: {$parser->error->line} :: Column: {$parser->error->column}";
		$parser->error = $error;
	}
	foreach ($parser->nodes as $node)
	{
		if (isset($node->trunk))
		{
		//	$trunk = &$parser->nodes[$node->trunk];
		//	print $trunk->name."\n";
		}
		if (isset($node->trace))
		{
			
		}
		// expand object values for testing
		foreach ($node as $name => &$value)
		{
			switch ($name)
			{
				case 'type':
				{
					$value = "$value\t\t".$parser->getTypeString($value);
					break;
				}
				case 'flag':
				{
					$value = "$value\t\t".$parser->getFlagString($value);
					break;
				}
				case 'state':
				{
					$value = "$value\t".$parser->getStateString($value);
					break;
				}
				case 'value':
				{
					$value = "|$value|"; // easier to read |white space|
					break;
				}
				case 'depth':
				{
					$value = "$value\t[NODE NESTING]";
					break;
				}
				case 'index':
				{
					$value = "$value\t[NODE INDEX]";
					break;
				}
				case 'trunk':
				{
					$value = "$value\t[PARENT INDEX]";
					break;
				}
				case 'trace':
				{
					$value = "$value\t[CHILDREN: ".implode(',', $parser->getChildIds($node))."]";
					break;
				}
				case 'split':
				{
					$value = "$value\t[COMPLEMENT]";
					break;
				}
			}
			if (is_null($value)) $value = 'NULL'; // easier to read NULL
		}
	}
	return $parser;
}

function buildDOM ($source)
{
	$parser = new DOMBuilder;
	$parser->parse($source);
	return $parser->build();
}


?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Parser Tests</title>
<script type="text/javascript">

function resetPage ()
{
	location.href = 'parser_tests.php';
}

function setFocus (id)
{
	document.getElementById(id).focus();
}
</script>
<style type="text/css">

table {
  border-collapse: collapse;
}

.green {
  background: lightgreen;
}

th {
  text-align: left;
}

th, td {
  width: 130px;
  padding: 4px 12px;
  vertical-align: top;
}

#file {
  
}

#href {
  width: 100%;
}

#text {
  width: 100%;
  height: 250px;
}

pre {
  width: 700px;
  overflow: auto;
  margin: 20px;
  padding: 6px;
  border: 1px dashed;
  background: #EEE;
}

.alert {
  color: red;
}

small {
  display: block;
  padding: 2px;
}

</style>
</head>
<body>
<h1>Parser Tests</h1>

<h2>Enter Source Code</h2>
<?php echo ($error) ? "<p class=\"alert\">$error</p>" : ""; ?>
<form action="parser_tests.php" method="post" enctype="multipart/form-data">
<table>
	<tr class="green">
		<th><label for="xml">Parse XML: </label><input type="checkbox" id="xml" name="xml" /></th><!-- checked -->
		<th><label for="dom">Parse DOM: </label><input type="checkbox" id="dom" name="dom" checked /></th>
		<th><label for="src">Build Source: </label><input type="checkbox" id="src" name="src" checked /></th>
	</tr>
	<tr>
		<td>
			<input type="radio" name="parse" id="rfile" value="file" onclick="setFocus('file')"<?php echo $rfileck; ?> />
			<label for="rfile"> From File</label>
		</td>
		<td colspan="2">
			<label for="rfile">
				<input type="file" id="file" name="file" value="<?php echo $file; ?>" />
			</label>
		</td>
	</tr>
	<tr>
		<td>
			<input type="radio" name="parse" id="rhref" value="href" onclick="setFocus('href')"<?php echo $rhrefck; ?> />
			<label for="rhref"> From URL</label>
		</td>
		<td colspan="2">
			<label for="rhref">
				<input type="text" id="href" name="href" value="<?php echo $href; ?>" />
				<small>Example: <em>http://www.freshgrok.com/index.php</em></small>
			</label>
		</td>
	</tr>
	<tr>
		<td>
			<input type="radio" name="parse" id="rtext" value="text" onclick="setFocus('text')"<?php echo $rtextck; ?> />
			<label for="rtext"> From String</label>
		</td>
		<td colspan="2">
			<label for="rtext">
				<textarea id="text" name="text"><?php echo $text; ?></textarea>
				<small>Example: <em>&lt;html>Don't&lt;br />my parser!&lt;/html></em></small>
			</label>
		</td>
	</tr>
	<tr class="green">
		<td><input type="submit" name="submit" value="Parse It" /></td>
		<td colspan="2"><input type="button" value="Clear Everything" onclick="resetPage()" /></td>
	</tr>
</table>
</form>

<?php

if ($dosrc)
{
	$errstring = (isset($src->error)) ? $src->error : "Parsed No Error\n";
	echo "<h2>Raw Source from DOMBuilder</h2>\n";
	echo "<h3>Error Status: $errstring</h3>\n";
	$src = htmlentities($src);
	echo "<pre class=\"code\">$src</pre>";
}

if ($doxml)
{
	$errstring = (isset($xml->error)) ? $xml->error : "Parsed No Error\n";
	echo "<h2>Enhanced Results from XMLParser</h2>\n";
	echo "<h3>Error Status: $errstring</h3>\n";
	echo "<h3>Nodes Collection</h3>\n";
	echo "<pre>\n";
	print_r($xml->nodes);
	echo "</pre>\n";
	echo "<h3>Child Associations</h3>\n";
	echo "<pre>\n";
	print_r($xml->trace);
	echo "</pre>\n";
}

if ($dodom)
{
	$errstring = (isset($dom->error)) ? $dom->error : "Parsed No Error\n";
	echo "<h2>Enhanced Results from DOMParser</h2>\n";
	echo "<h3>Error Status: $errstring</h3>\n";
	echo "<h3>Nodes Collection</h3>\n";
	echo "<pre>\n";
	print_r($dom->nodes);
	echo "</pre>\n";
	echo "<h3>Child Associations</h3>\n";
	echo "<pre>\n";
	print_r($dom->trace);
	echo "</pre>\n";
}

?>
</body>
</html>