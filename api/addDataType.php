<?php
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");

    $name = "";
    $unit = "";
    $datatype = "";

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        // collect value of input field
        $name = $_GET['name'];
        $unit = $_GET['unit'];
        $datatype = $_GET['datatype'];
        if (empty($name) || empty($unit) || empty($datatype)) {
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

            $sql = "INSERT INTO datatypes (name, unit, datatype)
                    VALUES ('$name', '$unit', '$datatype')";

            if ($conn->query($sql) === TRUE) {
                //echo "New record created successfully";

                //$sql = "SELECT * FROM ID_list WHERE name='$name'";

                $sql = "SELECT t.typeID, t.name, t.unit, t.datatype FROM datatypes t
                        INNER JOIN (
                            SELECT MAX(typeID) as maxID FROM datatypes
                        ) tm ON t.typeID = tm.maxID";

                $result = $conn->query($sql);
                // echo($result->num_rows);
                if($result->num_rows > 0){
                    while($row = $result->fetch_assoc()) {
                        $json_data = json_encode($row);
                        echo $json_data;
                        //echo("ID: " . strval($row["ID"]) . " | Token: " . $row["token"]. " | Name: " . $row["name"]. " | Short Name: " . $row["unit"]. "<br>");
                    }
                } else {
                    echo "0 results";
                }
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }

            $conn->close();
        }
    }
    else{
        echo "no data given.";
    }
?>