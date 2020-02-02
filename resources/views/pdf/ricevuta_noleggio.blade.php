<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>

        <title>Ricevuta di Noleggio</title>

        <style>
            body{
                background: #fff;
                font-size: 0.9em;
            }
            .clear{
                clear: both;
            }
            h1,h2,h3,h4,h5,h6{
                margin:0px;
            }
            ul{
                padding:5px 0px;
                margin:0px;
                list-style: none;
            }
            .content {

                width: 100%;
            }
            .row {
                width: 100%;
            }
            .col-md-8 {
                max-width: 65.6666666667%;
                position: relative;
                display: inline-block;
                width: 100%;
            }
            .col-md-6 {
                max-width: 49%;
                position: relative;
                display: inline-block;
                width: 100%;
            }
            .col-md-4 {
                position: relative;
                max-width: 33.3333333333%;
                display: inline-block;
                width: 100%;
            }
            .col-md-3 {
                max-width: 22.667%;
                position: relative;
                display: inline-block;
                width: 100%;
            }
            .col-md-12 {
                max-width: 100%;
            }
            .float-right{
                float: right;
            }
            .float-left{
                float: left;
            }
            .text-center{
                text-align: center;
            }
            .text-left{
                text-align: left;
            }
            .text-right{
                text-align: right;
            }
            .d-inline-block{
                display: inline-block;
            }
            .table {
                width: 100%;
                margin-bottom: 1rem;
                color:
                #212529;
            }
            .table thead th {
                vertical-align: bottom;
                border-bottom: 2px solid
                #dee2e6;
            }
            .table td, .table th {
                padding: .75rem;
                vertical-align: top;
                border-top: 1px solid
                #dee2e6;
            }
            .pl-4, .px-4 {
                padding-left: 1.5rem !important;
            }
            .pr-4, .px-4 {
                padding-right: 1.5rem !important;
            }
            .mt-5, .my-5 {
                margin-top: 2rem !important;
            }
            .mb-5, .my-5 {
                margin-bottom: 2rem !important;
            }
            .mt-4, .my-4 {
                margin-top: 1.5rem !important;
            }
            .mb-4, .my-4 {
                margin-bottom: 1.5rem !important;
            }
            .mb-3, .my-3 {
                margin-bottom: 1rem !important;
            }
            .hf {
                height: 30px;
                background: #256ba7 !important;
            }
            .pt-2 .py-2{
                padding-top: 1.3rem !important;
            }
            .pb-2 .py-2{
                padding-bottom: 1.3rem !important;
            }

            hr {
                margin-top: 10px;
                margin-bottom: 10px;
                border: 0;
                border-top: 1px solid rgba(0,0,0,.1);
                clear: both;
            }
            .logo {
                width: 100px;
                margin: auto;
            }
            .logo  img{
                width: 100%;
            }
            .tot {
                font-size: 1.3em;
            }
            .h-line {
                border:0.5px solid #666;
                margin: 30px auto 0;
                max-width: 180px;
            }
        </style>

    </head>

    <body>
        <div class="mb-5">
            <div class="container">
                <div class="row hf mb-4"></div>

                <div class="row">
                    <div class="col-md-8 float-left">
                        <div class="text-left">
                            <h4>Ricevuta di Noleggio</h4>
                            <ul>
                                <li>
                                    Movie Rental - {{$ptVendita['titolo']}}
                                </li>
                                <li>
                                    {{$ptVendita['indirizzo']}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 text-center float-right">
                        <div class="logo ">
                            <img src="{{asset('img/rent.jpg')}}" />
                        </div>
                        <ul>
                            <li>
                                Data:
                                @php
                                    date_default_timezone_set('UTC');
                                    echo date('d/m/Y');
                                @endphp
                            </li>
                            <li>Ricevuta n. {{rand()}}
                            </li>
                        </ul>
                    </div>
                </div>
                <hr/>

                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="">
                            <h4>Cliente</h4>
                            <ul>
                                <li>
                                    <strong>Sig./Sig.ra:</strong> {{$cliente['nome']}}
                                </li>
                                <li>
                                    <strong>Indirizzo:</strong> {{$cliente['indirizzo']}}
                                </li>
                                <li>
                                    <strong>Tel:</strong> {{$cliente['telefono']}} - <strong>Cell:</strong> {{$cliente['cellulare']}}
                                </li>
                                <li>
                                    <strong>Email:</strong> {{$cliente['email']}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Descrizione</th>
                                    <th>Data Riconsegna</th>
                                    <th>N. giorni noleggio</th>
                                    <th>Prezzo uni.</th>
                                    <th>Sconto giorni</th>
                                    <th>Sconto Fidelizzazione</th>
                                    <!--<th>Ritardo riconsegna (gg)</th>
                                    <th>Danneggiato</th>-->
                                    <th>Importo complessivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($tabella as $item)
                                    <tr>
                                        <td>{{$item['descrizione']}}</td>
                                        <td>{{date('d-m-Y', strtotime($item['data_riconsegna']))}}</td>
                                        <td>{{$item['n_giorni']}}</td>
                                        <td>{{number_format($item['prezzo'],2)}} €</td>
                                        <td>{{number_format($item['scontoGiorni'],2)}} €</td>
                                        <td>{{$titleField}} {{$percField}} %</td>
                                        <td class="text-right">{{number_format($item['importo'],2)}} €</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                        <div class="text-right py-2 px-2 tot">
                            <strong>Totale:</strong> {{number_format($totale,2)}} €
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-3 col-sm-4 col-xs-3 text-center">
                        <span>Firma per ricevuta</span>
                        <div class="h-line"></div>
                    </div>
                </div>
            </div>

        </div>

        <div>
            <div class="container">
                <div class="row hf mt-5"></div>
            </div>
        </div>
    </body>

</html>
