<?php
    function generateToken(){
        return substr(sha1(strval(microtime(true))), -16, 16);
    }

    function getDatatypeFromID($conn, $ID){
        $sql = "SELECT datatype FROM datatypes WHERE typeID=$ID";

        $result = $conn->query($sql);

        // echo($result->num_rows);
        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()) {
                return $row["datatype"];
            }
        } else {
            echo "0 results";
        }
    }

    function createSensorTable($conn, $tb_name, $dtypes){
        $sql = "CREATE TABLE $tb_name (
                    timestamp DATETIME NOT NULL,
                    $dtypes
                    PRIMARY KEY (timestamp)
                );";

        //echo $sql . "</br>";

        if ($conn->query($sql) === TRUE) {
            return TRUE;
        }
    }
    
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");

    $name = "";
    $short_name = "";
    $datatypes = "";
    $typenames = "";

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $name = $_GET['name'];
        $short_name = $_GET['short_name'];
        $datatypes = $_GET['datatypes'];
        $typenames = $_GET['typenames'];
        // typenames is optional
        if (empty($name) || empty($short_name) || empty($datatypes)) {
            echo "not enough arguments.";
            return;
        }
    }
    else if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = $_POST['name'];
        $short_name = $_POST['short_name'];
        $datatypes = $_POST['datatypes'];
        $typenames = $_POST['typenames'];
        // typenames is optional
        if (empty($name) || empty($short_name) || empty($datatypes)) {
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

    $token = generateToken();
    //echo($token);

    // Add new Sensor to List of Sensors.
    // token is a random string.
    // name is the display name.
    // short name is a shortened version for displaying on smaller spaces.
    // datatypes is a semicolon separated list containing the datatype IDs from the datatypes table.
    // typenames is a semicolon separated list containing display names for each datatype.
    $sql = "INSERT INTO ID_list (token, name, short_name, datatypes, typenames)
            VALUES ('$token', '$name', '$short_name', '$datatypes', '$typenames')";

    if ($conn->query($sql) === TRUE) {
        // echo "New record created successfully";

        // Get most recently added Sensor and generate a JSON representation.
        $sql = "SELECT t.ID, t.token, t.name, t.short_name, t.datatypes, t.typenames FROM ID_list t
                INNER JOIN (
                    SELECT MAX(ID) as maxID FROM ID_list
                ) tm ON t.ID = tm.maxID";

        $result = $conn->query($sql);
        // echo($result->num_rows);
        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()) {
                $json_data = json_encode($row);
                echo $json_data . "</br>";
                //echo("ID: " . strval($row["ID"]) . " | Token: " . $row["token"]. " | Name: " . $row["name"]. " | Short Name: " . $row["short_name"]. "<br>");
                
                $sensorID = strval($row["ID"]);
                $dt_array = explode(";", $datatypes);
                $n_dt = count($dt_array);
                //echo explode(";", $datatypes) . "</br>";
                //echo $n_dt . "</br>";
                
                $col_names = "";
                for($i = 0; $i < $n_dt; $i++){
                    $col_names .= "value" . $i . " " . getDatatypeFromID($conn, $dt_array[$i]) . ",";
                }
                //echo $col_names . "</br>";

                if(createSensorTable($conn, "Sensorvalues_$sensorID", $col_names) == TRUE){
                    // nice
                }
                else{
                    echo "Error creating the Sensorvalues Table. </br>";
                }
            }
        } else {
            echo "0 results";
        }
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
?>