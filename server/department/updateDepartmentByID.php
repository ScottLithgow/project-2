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

	$department = trim($_POST['department']);
    $department_ID = $_POST['department_ID'];
    $location_ID = $_POST['location_ID'];

	$query = 
        "UPDATE department
        SET name = ?,
            locationID = ?
        WHERE id = ?";
	
	$update_department = $conn->prepare($query);
	$update_department->bind_param('sii', $department, $location_ID, $department_ID);

	$result = $update_department->execute();
	
	if (false === $update_department) {

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