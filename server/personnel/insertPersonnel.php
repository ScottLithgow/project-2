<?php
	$executionStartTime = microtime(true);
	
	include("../config.php");

	header('Content-Type: application/json; charset=UTF-8');

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	$first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    $email = trim($_POST['email']);
	$departmentID = $_POST['departmentID'];

	$query = 'INSERT INTO personnel (firstName, lastName, email, departmentID) VALUES(?,?,?,?)';

	$insert_personnel = $conn->prepare($query);

	$insert_personnel->bind_param("sssi", $first_name, $last_name, $email, $departmentID);

	$insert_personnel->execute();
	
	if (false === $insert_personnel) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>