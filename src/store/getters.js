export default {
  isSuperUser(state) {
    return state.user.isSuperUser;
  },

  allRoles(state) {
    return state.allRoles;
  },

  groupedPermissions(state) {
    const { allPermissions } = state;

    const calendarPerms = allPermissions.filter(perm => perm.parent.type === 'calendar');
    const forumPerms = allPermissions.filter(perm => perm.parent.type === 'forum');

    function groupByParent(arr) {
      const objGroup = arr.reduce((acc, cur) => {
        if (acc[cur.parent.id] === undefined) {
          acc[cur.parent.id] = [];
        }

        acc[cur.parent.id].push(cur);

        return acc;
      }, {});

      return Object.keys(objGroup).map(key => ({
        parent: objGroup[key][0].parent,
        permissions: objGroup[key],
      }));
    }

    return {
      calendar: groupByParent(calendarPerms),
      forum: groupByParent(forumPerms),
    };
  },
};
