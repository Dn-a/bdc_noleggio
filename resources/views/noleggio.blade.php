@extends('layouts.app')

@section('temp')
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
@endsection

@section('styles')
    <!-- Material Design -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
@endsection



@section('content')

    <header>

        <button type="button" id="sidebarCollapse" class="btn btn-link">
            <i class="fa fa-align-left"></i>
        </button>

        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm pl-5">

            <div class="container-fluid">

                <a class="navbar-brand" href="">
                    <strong>Video</strong>Noleggio
                </a>

                <div class="navbar-collapse d-table" id="navbarSupportedContent">

                    <!--
                    <ul class="navbar-nav mr-auto">

                    </ul>
                    -->
                    <ul class="navbar-nav ml-auto">

                            <li class="nav-item dropdown">
                                <span>{{ Auth::user()->ruolo->titolo }}: </span>
                                <a id="navbarDropdown" class="nav-link dropdown-toggle d-inline-block" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre="false">
                                    {{ Auth::user()->nome }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right position-absolute" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href=""
                                    onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                        Logout
                                    </a>
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style={style} >
                                        @csrf
                                    </form>
                                </div>
                            </li>
                    </ul>
                </div>

            </div>

        </nav>
    </header>

    <div id="noleggio">
    </div>

    <!--
        <footer class="px-2">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-10 py-4">
                        <ul class="pl-2 list-inline">
                            <li class="list-inline-item">Corso: Basi di Dati e di Conoscenza</li>
                            <li class="list-inline-item">Prof: L. Regoli</li>
                            <li class="list-inline-item">Studende: Antonino Di Natale</li>
                            <li class="list-inline-item">Matricola: 0012253</li>
                        </ul>
                    </div>
                    <div class="col-md-2 py-4 text-center">
                        <p>UniMarconi</p>
                    </div>
                </div>
            </div>
        </footer>
    -->

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

@endsection
