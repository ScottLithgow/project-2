<?php

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

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

    $filter = '';

    if($_POST['filter'] === 'firstName') {
        $filter = 'p.firstName';
    } else if ($_POST['filter'] === 'lastName') {
        $filter = 'p.lastName';
    } else if ($_POST['filter'] === 'department') {
        $filter = 'd.name';
    } else if ($_POST['filter'] === 'location') {
        $filter = 'l.name';
    } else if ($_POST['filter'] === 'email') {
        $filter = 'p.email';
    }

    $filter_direction = '';

    if($_POST['filter_direction'] === 'ASC') {
        $filter_direction = ' ASC';
    } else if ($_POST['filter_direction'] === 'DESC') {
        $filter_direction = ' DESC';
    }

     $query_string = '
        SELECT p.id as personnelID, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location 
        FROM personnel p
        LEFT JOIN department d 
            ON (d.id = p.departmentID)
        LEFT JOIN location l 
            ON (l.id = d.locationID)
        WHERE(
            (p.firstName LIKE ?)
            OR (p.lastName LIKE ?)
            OR (p.email LIKE ?)
            OR (d.name LIKE ?)
            OR (l.name LIKE ?)
        )
        ORDER BY ' ;
    
    $query_string .= $filter;

    $query_string .= $filter_direction;

    $query = $conn->prepare($query_string);

	$query->bind_param("sssss", $_POST['search'], $_POST['search'], $_POST['search'], $_POST['search'], $_POST['search']);

	$query->execute();

    $result = $query->get_result();
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>