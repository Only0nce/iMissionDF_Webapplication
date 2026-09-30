<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head><script src="assets/theme/app-theme.js"></script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.122.0">
    <title>IFZ: iScan MR-10 WebRx</title>
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="fontawesome-free-5.15.4-web/css/all.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">
    <link href="login.css" rel="stylesheet">

  <link href="assets/theme/app-theme.css" rel="stylesheet">
</head>


<body>
<!-- Main Content -->
  <div class="container">
    <div class="row main-content text-center">
      <div class="col-md-4 text-center company__info">
        <svg class="bi_logo" style="width: 100%; color: white; "><use xlink:href="dashboard.svg#logo"/></svg>
        <h4 class="company_title">iScan MR-10</h4>
      </div>
      <div class="col-md-8 col-xs-12 col-sm-12 login_form ">
        <div class="container">
          <div class="row">
            <h2 class="mt-3">Log In</h2>
          </div>
          <div class="row">
            <form control="" class="form-group" name="formlogin" method="post" action="check_login.php">
              <div class="row">
                <input type="text" name="username" id="username" class="form__input" placeholder="Username">
              </div>
              <div class="row">
                <!-- <span class="fa fa-lock"></span> -->
                <input type="password" name="password" id="password" class="form__input" placeholder="Password">
              </div>
              <div class="row">
                <input type="submit" value="Submit" class="form__btn">
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer -->

</body>

<script src="assets/dist/js/bootstrap.bundle.min.js"></script>

</html>

<!--     <form class="login-form" name="form1" method="post" action="check_login.php">
    <div class="form-group">
    <input type="text" id="username" name="username"  class="form-control" placeholder="" required>
    <label for="username">Username</label>
    </div>
    <div class="form-group">
    <input type="password" id="password" name="password"  class="form-control" placeholder="" required>
    <label for="password">Password</label>
    </div>
    <button class="button button2" type="submit"  name="Submit">LOGIN</button> -->