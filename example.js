'use strict';

const { Client, ValidationException, NotFoundException } = require('./src/index.js');

// Insert your API key here
const API_KEY = 'YOUR_API_KEY_HERE';

const client = new Client(API_KEY);

async function main() {
    // ─── Profile ──────────────────────────────────────────────────────────────
    console.log('=== Profile ===');
    const profile = await client.profile().me();
    console.log('Client:', profile.client.name, '|', profile.client.email);
    console.log('User:', profile.user.name, '|', profile.user.email);
    console.log('Plan:', profile.plan.name, '(until', profile.plan.endDatetime + ')');
    console.log('API links remaining:', profile.usages.apiLinks.remaining, '/', profile.usages.apiLinks.limit);
    console.log();

    // ─── Create a short link ──────────────────────────────────────────────────
    console.log('=== Create link ===');
    const created = await client.links().create(
        'https://example.com',  // url
        null,                   // alias — null = auto-generated
        'My test link',         // title
    );
    console.log('Created:', created.link.shortUrl, '→', created.link.url);
    console.log('ID:', created.link.id, '| Alias:', created.link.alias);
    console.log('API links used:', created.usage.used, '/', created.usage.limit);
    console.log();

    const linkId = created.link.id;

    // ─── Get link by ID ───────────────────────────────────────────────────────
    console.log('=== Get link by ID ===');
    const link = await client.links().get(linkId);
    console.log('Link:', link.shortUrl, '| Title:', link.title);
    console.log();

    // ─── Update link ──────────────────────────────────────────────────────────
    console.log('=== Update link ===');
    const updated = await client.links().update(linkId, null, 'Updated title');
    console.log('Updated:', updated.link.shortUrl, '| Title:', updated.link.title);
    console.log();

    // ─── List links ───────────────────────────────────────────────────────────
    console.log('=== List links (first 3) ===');
    const linksPage = await client.links().list(3);
    for (const l of linksPage.links) {
        console.log('-', l.shortUrl, '→', l.url);
    }
    console.log('Total links:', linksPage.meta.total);
    console.log();

    // ─── Create a group ───────────────────────────────────────────────────────
    console.log('=== Create group ===');
    const group = await client.groups().create('Test group', 'Created via JS SDK');
    console.log('Group created:', group.name, '| ID:', group.id, '| URL:', group.url);
    console.log();

    // ─── List groups ──────────────────────────────────────────────────────────
    console.log('=== List groups ===');
    const groupsPage = await client.groups().list(5);
    for (const g of groupsPage.groups) {
        console.log('-', g.name, '|', g.url);
    }
    console.log('Total groups:', groupsPage.meta.total);
    console.log();

    // ─── Delete the test link ─────────────────────────────────────────────────
    console.log('=== Delete test link ===');
    await client.links().delete(linkId);
    console.log('Link', linkId, 'deleted.');
}

main().catch((err) => {
    if (err instanceof ValidationException) {
        console.error('Ошибка валидации:', err.data);
    } else if (err instanceof NotFoundException) {
        console.error('Не найдено:', err.message);
    } else {
        console.error('Ошибка:', err.message);
    }
    process.exit(1);
});
