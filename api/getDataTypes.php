<?php
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");

    $servername = "localhost";
    $username = "api";
    $password = "api1234api";
    $dbname = "logger01";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM datatypes";

    $result = $conn->query($sql);

    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()) {
            $json_data = json_encode($row);
            echo $json_data . "</br>";
        }
    } else {
        echo "0 results";
    }

    $conn->close();

?>