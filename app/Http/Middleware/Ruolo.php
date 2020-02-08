<?php

namespace App\Http\Middleware;

use Closure;

class Ruolo
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $roles)
    {
        $roles = explode('|',$roles);
        $ruolo = strtolower($request->user()->ruolo->titolo);
        //var_dump($roles);exit;
        if(!in_array($ruolo, $roles))
        {
            return redirect()->back();

        }

        return $next($request);
    }
}
