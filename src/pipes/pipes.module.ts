import { NgModule } from '@angular/core';
import { OrderByPipe } from './order-by/order-by';
import { FilterPipe } from './filter/filter';
@NgModule({
	declarations: [OrderByPipe,
    FilterPipe],
	imports: [],
	exports: [OrderByPipe,
    FilterPipe]
})
export class PipesModule {}
