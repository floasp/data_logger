CREATE TABLE `datatypes` (
 `typeID` int(11) NOT NULL AUTO_INCREMENT,
 `datatype` varchar(32) NOT NULL,
 `name` varchar(32) NOT NULL,
 `unit` varchar(16) NOT NULL,
 PRIMARY KEY (`typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4

CREATE TABLE `ID_list` (
 `ID` int(11) NOT NULL AUTO_INCREMENT,
 `token` varchar(16) NOT NULL,
 `name` varchar(64) NOT NULL,
 `short_name` varchar(5) NOT NULL,
 `datatypes` varchar(255) NOT NULL,
 `typenames` varchar(1024) NOT NULL,
 PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4