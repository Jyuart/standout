import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { settingsFacet, standoutView } from 'extension';
import { StandoutSettings } from 'types';


const DEFAULT_SETTINGS: StandoutSettings = {
	dateColor: 'lightyellow'
}

export default class StandoutPlugin extends Plugin {
	settings: StandoutSettings;

	async onload() {
		await this.loadSettings();
		this.registerEditorExtension([
			settingsFacet.of(this.settings),
			standoutView]);
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: StandoutPlugin;

	constructor(app: App, plugin: StandoutPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Date Color')
			.setDesc('Color of background')
			.addText(text => text
				.setPlaceholder('Enter color (RGB, HEX, etc.)')
				.setValue(this.plugin.settings.dateColor)
				.onChange(async (value) => {
					this.plugin.settings.dateColor = value;
					await this.plugin.saveSettings();
				}));
	}
}
