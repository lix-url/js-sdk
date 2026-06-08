'use strict';

const { Link, Links: LinksDto, LinkShortenResult, ResponseMeta, UsageItem } = require('../dto/index.js');
const { Groups } = require('./Groups.js');

class Links {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async create(
    url,
    alias = null,
    title = null,
    groupId = null,
    tags = [],
    meta = [],
    utm = [],
    trackingPixelIds = [],
    activeBeforeDatetime = null,
    password = null,
    isPublic = true,
  ) {
    const data = await this.apiClient.createLink({
      group_id: groupId,
      url,
      alias,
      password,
      title,
      tags,
      is_public: isPublic,
      tracking_pixel_ids: trackingPixelIds,
      meta,
      utm,
      active_before_datetime: activeBeforeDatetime,
    });

    return new LinkShortenResult(
      Links.linkFromResponseData(data.data),
      new UsageItem(data.usage.limit, data.usage.used, data.usage.remaining),
    );
  }

  async update(
    id,
    url = null,
    title = null,
    groupId = null,
    tags = [],
    meta = [],
    utm = [],
    trackingPixelIds = [],
    activeBeforeDatetime = null,
    password = null,
    isPublic = true,
  ) {
    const data = await this.apiClient.updateLink(id, {
      group_id: groupId,
      url,
      password,
      title,
      tags,
      is_public: isPublic,
      tracking_pixel_ids: trackingPixelIds,
      meta,
      utm,
      active_before_datetime: activeBeforeDatetime,
    });

    return new LinkShortenResult(
      Links.linkFromResponseData(data.data),
      new UsageItem(data.usage.limit, data.usage.used, data.usage.remaining),
    );
  }

  async get(id) {
    const data = await this.apiClient.getLink(id);
    return Links.linkFromResponseData(data.data);
  }

  async delete(id) {
    await this.apiClient.deleteLink(id);
  }

  async list(limit = null, fromId = null) {
    const data = await this.apiClient.getLinks(limit, fromId);

    const links = data.data.map((linkData) => Links.linkFromResponseData(linkData));

    return new LinksDto(
      links,
      new ResponseMeta(data.meta.total, data.meta.limit, data.meta.next_url),
    );
  }

  static linkFromResponseData(linkData) {
    return new Link(
      linkData.id,
      linkData.alias,
      linkData.url,
      linkData.short_url,
      linkData.title,
      Groups.groupFromResponseData(linkData.group),
      linkData.tags,
      linkData.meta,
      linkData.is_public,
      linkData.created_datetime,
      linkData.active_before_datetime,
      linkData.deleted_datetime,
    );
  }
}

module.exports = { Links };
