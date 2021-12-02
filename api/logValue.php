<?php

    function getNumberOfValues($conn, $ID){
        $sql = "SELECT * FROM ID_list WHERE ID = $ID";

        $result = $conn->query($sql);

        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()) {
                return count($row);
            }
        } else {
            echo "0 results";
        }
        return 0;
    }

    function getToken($conn, $ID){
        $sql = "SELECT token FROM ID_list WHERE ID = $ID";

        $result = $conn->query($sql);

        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()) {
                return $row["token"];
            }
        } else {
            echo "0 results";
        }
        return 0;
    }

    function println($string){
        echo $string . "</br>";
    }

    function checkToken($token1, $token2){
        return strcmp($token, $real_token) == 0;
    }
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");

    $sensorID = "";
    $token = "";
    $values = "";

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        // collect value of input field
        $sensorID = $_GET['sensorID'];
        $token = $_GET['token'];
        $values = $_GET['values'];
        if (empty($sensorID) || empty($values) || empty($token)) {
            echo "not enough arguments.";
        } else {
            //echo $name;
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

            $real_token = getToken($conn, $sensorID);

            if(checkToken($token, $real_token)){
                //$nv = getNumberOfValues($conn, $sensorID);
                $value_array = explode(";", $values);
                $nv = count($value_array);
                $value_array = implode(",", $value_array);

                $colnames = "";
                for($i = 0; $i < $nv; $i++){
                    $colnames .= "value" . $i . ", ";
                }
                $colnames = substr($colnames, 0, -2);
    
                $sql = "INSERT INTO Sensorvalues_$sensorID (timestamp, $colnames)
                        VALUES (NOW(), $value_array)";
    
                // echo $sql . "</br>";
    
                if ($conn->query($sql) === TRUE) {
                    echo TRUE;
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
            else{
                println("wrong token");
            }

            $conn->close();
        }
    }
    else{
        echo "no data given.";
    }
?>