<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head><script src="assets/js/color-modes.js"></script>

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

</head>


<body>
    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
      <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
              id="bd-theme"
              type="button"
              aria-expanded="false"
              data-bs-toggle="dropdown"
              aria-label="Toggle theme (auto)">
        <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="dashboard.svg#circle-half"></use></svg>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg#sun-fill"></use></svg>
            Light
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg#moon-stars-fill"></use></svg>
            Dark
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg#circle-half"></use></svg>
            Auto
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg#check2"></use></svg>
          </button>
        </li>
      </ul>
    </div>


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