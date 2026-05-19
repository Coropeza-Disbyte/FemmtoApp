const BasePage = require('../BasePage');

class WeightDetailsPage extends BasePage {
  // Header
  get screenTitle()         { return this.$text('Composición corporal'); }

  // Tabs de período (día / semana / mes)
  get selectorDia()         { return this.$text('Día'); }
  get selectorSemana()      { return this.$text('Semana'); }
  get selectorMes()         { return this.$text('Mes'); }

  // Botón historial
  get btnVerHistorial()     { return this.$contains('historial'); }

  // Tabs de detalle
  get tabGeneral()          { return this.$text('General'); }
  get tabSegmentada()       { return this.$text('Segmentada'); }

  // Sección de valores promedio
  get labelValoresPromedio(){ return this.$text('Valores promedio'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async tapVerHistorial()   { await this.tap(this.btnVerHistorial); }
  async tapTabGeneral()     { await this.tap(this.tabGeneral); }
  async tapTabSegmentada()  { await this.tap(this.tabSegmentada); }
  async selectPeriodDia()   { await this.tap(this.selectorDia); }
  async selectPeriodSemana(){ await this.tap(this.selectorSemana); }
  async selectPeriodMes()   { await this.tap(this.selectorMes); }
}

module.exports = WeightDetailsPage;
