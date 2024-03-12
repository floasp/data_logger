<?php
    function println($string){
        echo $string . "</br>";
    }
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");

    $sensorID = "";
    // can be 'time' or 'top'
    $filter = "";
    // from and to have to be in the format YYYY-MM-DD HH:MM:SS
    $from = "";
    $to = "";
    $top = "";

    $requester = "";

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $requester = $_GET;
    }
    else if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $requester = $_POST;
    }
    else{
        return;
    }

    // collect value of input field
    $sensorID = $requester['sensorID'];
    $filter = $requester['filter'];
    $from = $requester['from'];
    $to = $requester['to'];
    $top = $requester['top'];

    if(empty($sensorID) || empty($filter)){
        echo "not enough arguments. sensorID or filter missing.";
        return;
    }

    if($filter == "time"){
        if (empty($from) || empty($to)) {
            echo "not enough arguments. missing 'from' and/or 'to'";
            return;
        } 

        include 'dbsecrets.php';

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "SELECT * FROM Sensorvalues_$sensorID WHERE timestamp > '$from' AND timestamp < '$to'";

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
    }

    else if($filter == "top"){
        if (empty($top)) {
            echo "not enough arguments. missing 'top'.";
        } 

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

        $sql = "SELECT * FROM Sensorvalues_$sensorID ORDER BY timestamp DESC LIMIT $top";

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
    }
?>