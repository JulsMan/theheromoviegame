<?php

	$NPCTYPE = $_GET('type');
	$NPCName = $_GET('name');


    $dt = $date = date('m/d/Y h:i:s a', time());
	  $var = "A dawning of a new day, $dt.  We can use server side code to make client side dialog.";
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Chatting with ....</title>
    <style>
		.textarea {
		  display:block;
		  background:none;
		  height:400px;
		  width:400px;
		  padding:10px;
		  color:rgb(236,236,236);
		  background-color: rgb(51,51,51);
		  font-size:130%;
		/*  border:1px solid rgb(171,202,243);*/
		  border:0;
		}
	</style>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css" />
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
	<script src="jquery.typetype.min.js"></script>
    <script type="text/javascript">
	$(function(){
		$('textarea').focus()
		  .typetype('<?php print $var; ?>', {
			callback: function() {
			  // $('body').addClass('reveal')
			}
		  }).delay(1500);
	});
    </script>
</head>
<body>
	<textarea spellcheck="false" class="textarea"></textarea>
        
</body>
</html>