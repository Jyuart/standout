import { PluginValue, EditorView, ViewUpdate, ViewPlugin, DecorationSet, Decoration, PluginSpec } from "@codemirror/view";
import { RangeSetBuilder, Facet } from "@codemirror/state";
import { StandoutSettings } from "types";


const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/g;

export const settingsFacet = Facet.define<StandoutSettings, StandoutSettings>({
	combine: (values) => values[0],
});

class StandoutView implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		this.decorations = this.buildDecorations(update.view);
	}

	buildDecorations(view: EditorView) {
		const builder = new RangeSetBuilder<Decoration>();
		const settings = view.state.facet(settingsFacet);

		for (const { from, to } of view.visibleRanges) {
			const visibleText = view.state.doc.sliceString(from, to);
			let match;
			while ((match = dateRegex.exec(visibleText)) !== null) {
				const start = from + match.index;
				const end = start + match[0].length;
				const deco = Decoration.mark({
					class: "cm-date-highlight",
					attributes: {
						style: `background-color: ${settings.dateColor}; padding: 4px; border-radius: 3px;`,
					}
				});
				builder.add(start, end, deco);
			}
		}

		return builder.finish();
	}


	destroy() {
	}
}

const pluginSpec: PluginSpec<StandoutView> = {
	decorations: (value: StandoutView) => value.decorations,
};

export const standoutView = ViewPlugin.fromClass(StandoutView, pluginSpec);
