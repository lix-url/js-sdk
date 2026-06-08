'use strict';

class UsageItem {
  constructor(limit, used, remaining) {
    this.limit = limit;
    this.used = used;
    this.remaining = remaining;
  }
}

class Usages {
  constructor(links, apiLinks, massLinks) {
    this.links = links;
    this.apiLinks = apiLinks;
    this.massLinks = massLinks;
  }
}

class ResponseMeta {
  constructor(total, limit, nextUrl) {
    this.total = total;
    this.limit = limit;
    this.nextUrl = nextUrl;
  }
}

class ClientDto {
  constructor(id, name, email, createdDatetime) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdDatetime = createdDatetime;
  }
}

class User {
  constructor(name, email, createdDatetime) {
    this.name = name;
    this.email = email;
    this.createdDatetime = createdDatetime;
  }
}

class Plan {
  constructor(id, name, startDatetime, endDatetime) {
    this.id = id;
    this.name = name;
    this.startDatetime = startDatetime;
    this.endDatetime = endDatetime;
  }
}

class Profile {
  constructor(client, user, plan, usages) {
    this.client = client;
    this.user = user;
    this.plan = plan;
    this.usages = usages;
  }
}

class Group {
  constructor(id, alias, url, name, isRotate, description, createdDatetime, deactivatedDatetime) {
    this.id = id;
    this.alias = alias;
    this.url = url;
    this.name = name;
    this.isRotate = isRotate;
    this.description = description;
    this.createdDatetime = createdDatetime;
    this.deactivatedDatetime = deactivatedDatetime;
  }
}

class Groups {
  constructor(groups, meta) {
    this.groups = groups;
    this.meta = meta;
  }
}

class Link {
  constructor(id, alias, url, shortUrl, title, group, tags, meta, isPublic, createdDatetime, activeBeforeDatetime, deletedDatetime) {
    this.id = id;
    this.alias = alias;
    this.url = url;
    this.shortUrl = shortUrl;
    this.title = title;
    this.group = group;
    this.tags = tags;
    this.meta = meta;
    this.isPublic = isPublic;
    this.createdDatetime = createdDatetime;
    this.activeBeforeDatetime = activeBeforeDatetime;
    this.deletedDatetime = deletedDatetime;
  }
}

class Links {
  constructor(links, meta) {
    this.links = links;
    this.meta = meta;
  }
}

class LinkShortenResult {
  constructor(link, usage) {
    this.link = link;
    this.usage = usage;
  }
}

const MetaEnum = Object.freeze({
  META_TITLE: 'title',
  META_OG_TITLE: 'og:title',
  META_DESCRIPTION: 'description',
  META_OG_DESCRIPTION: 'og:description',
  META_KEYWORDS: 'keywords',
  META_OG_IMAGE: 'og:image',
});

module.exports = {
  UsageItem,
  Usages,
  ResponseMeta,
  ClientDto,
  User,
  Plan,
  Profile,
  Group,
  Groups,
  Link,
  Links,
  LinkShortenResult,
  MetaEnum,
};
