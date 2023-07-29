import {
  BaseFilter,
  FilterArguments,
  Item,
} from "../ddc-source-nvim-lsp/deps.ts";
import { CompletionItem } from "../ddc-source-nvim-lsp/completion_item.ts";

type LspKind = typeof CompletionItem.Kind[keyof typeof CompletionItem.Kind];

type Params = {
  priority: (LspKind | LspKind[])[];
};

export class Filter extends BaseFilter<Params> {
  filter({
    items,
    filterParams,
  }: FilterArguments<Params>): Promise<Item[]> {
    const priorityMap: Partial<Record<LspKind, number>> = {};
    filterParams.priority.forEach((kinds, i) => {
      if (Array.isArray(kinds)) {
        kinds.forEach((kind) => priorityMap[kind] = i);
      } else {
        priorityMap[kinds] = i;
      }
    });

    items.sort((a, b) =>
      (priorityMap[(a.kind ?? "") as LspKind] ?? 100) -
      (priorityMap[(b.kind ?? "") as LspKind] ?? 100)
    );
    return Promise.resolve(items);
  }

  params(): Params {
    return {
      priority: [],
    };
  }
}