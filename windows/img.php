<?php
	error_reporting(E_ALL);
  
  
	$pic =  $_GET['img'];
	$imgname = '';
	switch(strtolower ($pic))
	{
		case "hero":
			$imgname = './img/hero.png';
			break;
		case "skeleton":
			$imgname = './img/skeleton_warrior.png';
			break;
    case "ogre":
			$imgname = './img/ogre.png';
			break;
		default:
			$imgname = './img/unknown.png';
			break;
			
		
	}


	header("Location:$imgname");
?>