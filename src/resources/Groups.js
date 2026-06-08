'use strict';

const { Group, Groups: GroupsDto, ResponseMeta } = require('../dto/index.js');

class Groups {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async create(name, description = null, isRotate = false) {
    const data = await this.apiClient.createGroup({
      name,
      description,
      is_rotate: isRotate,
    });
    return Groups.groupFromResponseData(data.data);
  }

  async update(groupId, name = null, description = null, isRotate = false) {
    const data = await this.apiClient.updateGroup(groupId, {
      name,
      description,
      is_rotate: isRotate,
    });
    return Groups.groupFromResponseData(data.data);
  }

  async get(id) {
    const data = await this.apiClient.getGroup(id);
    return Groups.groupFromResponseData(data.data);
  }

  async delete(id) {
    await this.apiClient.deleteGroup(id);
  }

  async list(limit = null, fromId = null) {
    const data = await this.apiClient.getGroups(limit, fromId);

    const groups = data.data.map((groupData) => Groups.groupFromResponseData(groupData));

    return new GroupsDto(
      groups,
      new ResponseMeta(data.meta.total, data.meta.limit, data.meta.next_url),
    );
  }

  static groupFromResponseData(groupData) {
    if (!groupData) return null;

    return new Group(
      groupData.id,
      groupData.alias,
      groupData.url,
      groupData.name,
      groupData.is_rotate,
      groupData.description,
      groupData.created_datetime,
      groupData.deactivated_datetime,
    );
  }
}

module.exports = { Groups };
