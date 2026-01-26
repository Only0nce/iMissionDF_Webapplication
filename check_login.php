<?php
  include("dbConfig.php");
  session_start();
  $options = [
    'cost' => 12,
  ];
  $strSQL = "SELECT * FROM member WHERE Password=CONCAT('*', UPPER(SHA1(UNHEX(SHA1('".($_POST['password'])."'))))) AND Username = '".($_POST['username'])."' LIMIT 1";
  // echo($strSQL);
  // exit();

  $objQuery = mysqli_query($conn,$strSQL);
  if (!$objQuery) 
  {
          printf("Error: %s\n", $conn->error);
          exit();
  }

  $objResult = mysqli_fetch_array($objQuery);
  if(!$objResult)
  {
      echo("<script>location.href = 'login.php';</script>");
  }
  else
  { 
    $_SESSION["UserID"] = $objResult["id"];
    $_SESSION["userLevel"] = $objResult["userlevel"];
    $_SESSION["userName"] = $objResult["Username"];

    session_write_close();

    if($objResult["Username"] != "")
    {
        echo("<script>location.href = 'index.php';</script>");
    }
    else
    {
        echo("<script>location.href = 'login.php';</script>");
    }
  }

  mysqli_close($conn);

?>
