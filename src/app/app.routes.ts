import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login',  // ← SEUL CHANGEMENT
    pathMatch: 'full'
  },
  { 
    path: 'home',          // ← 'home' au lieu de ''
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    title: 'Accueil'
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./pages/cart/cart').then(m => m.Cart),
    title: 'Mon Panier'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    title: 'Connexion'
  },
  { 
    path: 'product/:id', 
    loadComponent: () => import('./pages/product-details/product-details').then(m => m.ProductDetails),
    title: 'Détails Produit'
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];