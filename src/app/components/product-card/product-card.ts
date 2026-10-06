import { 
  Component, OnChanges, SimpleChanges,
  Input, Output, EventEmitter,
  ContentChild, ElementRef, AfterContentInit
} from '@angular/core';
import { 
  CommonModule, CurrencyPipe, UpperCasePipe, 
  TitleCasePipe, DecimalPipe 
} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, UpperCasePipe, 
    TitleCasePipe, DecimalPipe, RouterModule
  ],
  templateUrl: './product-card.html',
})
export class ProductCard implements OnChanges, AfterContentInit {

  // ✅ @Input() syntaxe classique du cours
  @Input() product: any = null;

  // ✅ @Output() + EventEmitter syntaxe classique du cours
  @Output() addToCart = new EventEmitter<any>();

  // ✅ @ContentChild — récupère le contenu projeté
  @ContentChild('slotBadge') slotBadge!: ElementRef;

  // ✅ ngAfterContentInit
  ngAfterContentInit() {
    console.log('📦 AfterContentInit — contenu projeté:', this.slotBadge);
  }

  // ✅ ngOnChanges
  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      console.log('🔄 Produit changé:', changes['product'].currentValue);
      console.log('⬅️  Ancienne valeur:', changes['product'].previousValue);
      console.log('🆕 Premier changement:', changes['product'].firstChange);
    }
  }

  onAddToCart() {
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }
}