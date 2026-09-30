<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head><script src="assets/theme/app-theme.js"></script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.122.0">
    <title>Dashboard Template · Bootstrap v5.3</title>
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="fontawesome-free-5.15.4-web/css/all.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">

    <link href="assets/theme/app-theme.css" rel="stylesheet">
</head>

  
  <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
  <!-- <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">RCMS</a> -->
  <button class="nav-link px-3 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
        <svg class="bi_logo"><use xlink:href="dashboard.svg#logo"></use></svg>
        
  </button>
  <ul class="navbar-nav flex-row d-md-none">
    <li class="nav-item text-nowrap">
      <button class="nav-link px-3 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
        <svg class="bi"><use xlink:href="dashboard.svg#search"/></svg>
      </button>
    </li>
    <li class="nav-item text-nowrap">
      <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <svg class="bi"><use xlink:href="dashboard.svg#list"/></svg>
      </button>
    </li>
  </ul>

  <div id="navbarSearch" class="navbar-search w-100 collapse show">
    <input class="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search">
  </div>
</header>


  <body>
<?php
  include('dbConfig.php');
?>
<div class="container-fluid">
  
  <!-- Main Content -->
  <main>
<div class="login-page">
  <div class="form">
    <form class="login-form" name="form1" method="post" action="check_login.php">
    <div class="form-group">
    <input type="text" id="username" name="username"  class="form-control" placeholder="" required>
    <label for="username">Username</label>
    </div>
    <div class="form-group">
    <input type="password" id="password" name="password"  class="form-control" placeholder="" required>
    <label for="password">Password</label>
    </div>
    <button class="button button2" type="submit"  name="Submit">LOGIN</button>
    </form>
  </div>
</div>

  </main>
</div>
</body>
<script src="assets/dist/js/bootstrap.bundle.min.js"></script>

</html>
