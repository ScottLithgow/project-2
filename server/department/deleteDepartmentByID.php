<?php

	$executionStartTime = microtime(true);

	include("../config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$cd_host= getenv('cd_host');
	$cd_user= getenv('cd_user');
	$cd_password= getenv('cd_password');
	$cd_dbname= getenv('cd_dbname');
	$cd_port= getenv('cd_port');
	$cd_socket= getenv('cd_socket');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

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
	
	$select_query = $conn->prepare('DELETE FROM department WHERE departmentID = ?');
	
	$select_query->bind_param("i", $_REQUEST['department_ID']);

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


   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

    }

    if (sizeof($data) !== 0) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "Department has dependencies, so cannot be deleted.";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;
    }


	$delete_query = $conn->prepare('DELETE FROM department WHERE id = ?');
	
	$delete_query->bind_param("i", $_POST['department_ID']);

	$delete_query->execute();
	
	if (false === $delete_query) {

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