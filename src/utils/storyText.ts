import type { Lang } from '../contexts/language-context';
import type { Letter, NewsItem } from '../types';
import { EVENTS } from '../data/events';
import { PROJECTS } from '../data/projects';
import { HEADLINES, LETTERS, PROJECT_LETTERS, findCharacter } from '../data/story';

const fill = (text: string, params: Record<string, string | number>) =>
    text.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));

const eventTitle = (id: string | undefined, lang: Lang) =>
    EVENTS.find(e => e.id === id)?.title[lang] ?? '';

/** A letter as the player reads it: body, the highlighted line and who sent it. */
export function letterText(letter: Letter, lang: Lang) {
    const template = LETTERS[letter.kind];
    const character = findCharacter(letter.characterId);
    const params = {
        days: letter.causeDay !== undefined ? letter.day - letter.causeDay : 0,
        event: eventTitle(letter.eventId, lang),
        project: PROJECTS.find(p => p.id === letter.projectId)?.name[lang] ?? '',
    };
    const highlight = letter.message ?? PROJECT_LETTERS[letter.projectId ?? '']?.highlight;
    return {
        body: fill(template.body[lang], params),
        highlight: highlight ? highlight[lang] : fill(template.highlight?.[lang] ?? '', params),
        name: character?.name ?? '',
        role: character?.role[lang] ?? '',
        province: character?.province ?? '',
    };
}

export function headlineText(item: NewsItem, lang: Lang) {
    const project = PROJECTS.find(p => p.id === item.params?.project)?.name[lang];
    return fill(HEADLINES[item.key]?.[lang] ?? '', { ...item.params, ...(project ? { project } : {}) });
}
