@extends('layouts.app')

@section('content')

<main>
    <div id="login" class="container py-4 ">
        <div class="row justify-content-center">

            <div class="col-8 col-sm-6 col-xs-6 col-lg-4">
                <div class="card shadow">

                    <div class="card-body">

                        <h3 class="m-0 text-center pb-2"><strong>Benvenuto</strong></h3>
                        <div class="logo mb-5">
                            <img src="{{asset('img/rent.jpg')}}" />
                        </div>

                        <form method="POST" action="{{ route('login') }}">
                            @csrf

                            <div class="form-group row">
                                <!--
                                <label for="email" class="col-md-4 col-form-label text-md-right">Username</label>
                                -->
                                <div class="col-md-12">
                                    <i class="fa fa-user" aria-hidden="true"></i>

                                    <input id="email" placeholder="e-mail" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                    @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <!--
                                <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>
                                -->
                                <div class="col-md-12">
                                    <i class="fa fa-lock" aria-hidden="true"></i>
                                    <input id="password" placeholder="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row ">
                                <div class="col-md-12 ">
                                    <button type="submit" class="btn btn-primary btn-block">
                                        {{ __('Login') }}
                                    </button>

                                    @if (Route::has('password.request'))
                                        <a class="btn btn-link" href="{{ route('password.request') }}">
                                            {{ __('Forgot Your Password?') }}
                                        </a>
                                    @endif
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col-md-6 offset-md-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                        <label class="form-check-label" for="remember">
                                            Ricordami
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

@endsection
