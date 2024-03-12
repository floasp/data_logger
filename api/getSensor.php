<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");

    $sensorID = "";

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $sensorID = $_GET['sensorID'];
        if(empty($sensorID)){
            echo "not enough arguments.";
            return;
        }
    }
    else if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $sensorID = $_POST['sensorID'];
        if(empty($sensorID)){
            echo "not enough arguments.";
            return;
        }
    }
    else{
        return;
    }

    include 'dbsecrets.php';

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM ID_list WHERE ID = $sensorID";

    $result = $conn->query($sql);

    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()) {
            $json_data = json_encode($row);
            echo $json_data;
        }
    } else {
        echo "0 results";
    }

    $conn->close();

?>