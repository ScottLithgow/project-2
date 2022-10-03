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
	
	$select_query = $conn->prepare('SELECT count(id) as pc FROM department WHERE locationID = ?');
	
	$select_query->bind_param("i", $_REQUEST['location_ID']);

	$select_query->execute();
	
	$result = $select_query->get_result();
 
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "Delete failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

    }

	$data = mysqli_fetch_assoc($result);

    if ($data['pc'] != 0) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "Location has dependencies, so cannot be deleted.";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
    }

	$query = $conn->prepare('DELETE FROM location WHERE id = ?');
	
	$query->bind_param("i", $_POST['location_ID']);

	$query->execute();
	
	if (false === $query) {

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