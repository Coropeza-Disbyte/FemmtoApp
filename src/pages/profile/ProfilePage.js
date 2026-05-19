const BasePage = require('../BasePage');

class ProfilePage extends BasePage {
  // Header
  get screenTitle()           { return this.$text('Mi cuenta'); }

  // Sección "Mis datos"
  get sectionMisDatos()       { return this.$text('Mis datos'); }
  get fieldNombre()           { return this.$text('Nombre'); }
  get fieldEmail()            { return this.$text('E-Mail'); }
  get fieldContrasena()       { return this.$text('Contraseña'); }
  get fieldSexo()             { return this.$text('Sexo biológico'); }
  get fieldFechaNacimiento()  { return this.$text('Fecha de Nacimiento'); }
  get fieldPais()             { return this.$text('País de residencia'); }
  get fieldAltura()           { return this.$text('Altura'); }
  get fieldPeso()             { return this.$text('Peso'); }

  // Sección "Metas"
  get sectionMetas()          { return this.$text('Metas'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async tapNombre()           { await this.tap(this.fieldNombre); }
  async tapContrasena()       { await this.tap(this.fieldContrasena); }
  async tapSexo()             { await this.tap(this.fieldSexo); }
  async tapFechaNacimiento()  { await this.tap(this.fieldFechaNacimiento); }
  async tapAltura()           { await this.tap(this.fieldAltura); }
  async tapPeso()             { await this.tap(this.fieldPeso); }
  async tapMetas()            { await this.tap(this.sectionMetas); }
}

module.exports = ProfilePage;
