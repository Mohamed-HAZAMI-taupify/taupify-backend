const cacheController = require("../controllers/cache.controller");
const search = require("../controllers/search.controller");
const Article = require("../models/ArticleJournal.model");
const ContactEverest = require("../models/Contact.model");
const Coach = require("../models/Coach.model");
const ContactUsProspect = require("../models/MessageProspect.model");
const client_token = "everestsportclubbesancon";
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const timeController = require("../controllers/time.controller");
const filterController = require("../controllers/filter.controller");
const { getAll } = require("../controllers/rest-api/crud.controller");
const config = require("../config/config");


var today = new Date();
var lastDate = new Date();
lastDate.setDate(today.getDate() + 7);
const endedAt = lastDate
  .toISOString()
  .replace(/\.\d+Z/, "Z")
  .replace(/\:\d+Z/, "Z");
const DATE_SEARCH_OPTIONS_PLANNING = {
  weekday: "long",
};

const hours = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

const days = [
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI",
  "DIMANCHE",
];

const DATE_OPTIONS = {
  month: "numeric",
};

const resolvers = {
  Query: {
    coaches: async () => {
      const coaches = await Coach.find()
      return await coaches;
    },

    getfiltredCoaches: async (_parent, { filter }, _context, _info) => {
      const filtredCoaches = await Coach.find(
        filter.activity_contains && filter.activity_contains != [""]
          ? {
              activities: {
                $elemMatch: {
                  label: filter.activity_contains.map((activity) => activity),
                },
              },
            }
          : {}
      );

      return filtredCoaches;
    },

    getBackOfficeCoaches: async (_parent, { filter }, _context, _info) => {
      const filters = filterController.filterBackOfficeList(filter);
      const backOfficeCoaches = await Coach.find(filters);
      return backOfficeCoaches;
    },

    getMessagesEverest: async (_parent, { filter }, _context, _info) => {
      const filters = filterController.filterBackOfficeList(filter);
      const messages = await ContactUsProspect.find(filters);
      return messages;
    },

    getBackOfficeActivities: async (_parent, { filter }, _context, _info) => {
      const backOfficeActivities = await cacheController.getThroughCache(
        `${config.config.base_url_resamania}/${client_token}/activities`,
        "activities__key"
      );
      await backOfficeActivities.map((e) => {
        e.id = e["@id"];
      });

      return backOfficeActivities.filter(
        (activity) =>
          (filter.searching
            ? activity.name
                .toUpperCase()
                .includes(filter.searching.toUpperCase())
            : activity.name.includes("")) &&
          (filter.searchDateState == true && filter.searchDate
            ? activity.createdAt >
                filter.searchDate.split("T")[0] + "T" + "00:00:00.000Z" &&
              activity.createdAt <
                filter.searchDate.split("T")[0] + "T" + "23:59:59.000Z"
            : activity.createdAt.includes("")) &&
          (filter.searchMonth
            ? new Date(activity.createdAt)
                .toLocaleDateString("fr", DATE_OPTIONS)
                .includes(filter.searchMonth)
            : activity.createdAt.includes(""))
      );
    },

    getBackOfficeStudios: async (_parent, { filter }, _context, _info) => {
      const backOfficeStudios = await cacheController.getThroughCache(
        `${config.config.base_url_resamania}/${client_token}/studios`,
        "studios_key"
      );
      await backOfficeStudios.map((e) => {
        e.id = e["@id"];
      });
      return backOfficeStudios.filter(
        (studio) =>
          (filter.searching
            ? studio.name.toUpperCase().includes(filter.searching.toUpperCase())
            : studio.name.includes("")) &&
          (filter.searchDateState == true && filter.searchDate
            ? studio.createdAt >
                filter.searchDate.split("T")[0] + "T" + "00:00:00.000Z" &&
              studio.createdAt <
                filter.searchDate.split("T")[0] + "T" + "23:59:59.000Z"
            : studio.createdAt.includes("")) &&
          (filter.searchMonth
            ? new Date(studio.createdAt)
                .toLocaleDateString("fr", DATE_OPTIONS)
                .includes(filter.searchMonth)
            : studio.createdAt.includes(""))
      );
    },
    clubs: async () => {
      const clubs = await cacheController.getThroughCache(
        `${config.config.base_url_resamania}/${client_token}/clubs`,
        "clubs_key"
      );
      clubs.map((e) => {
        e.id = e["@id"];
      });
      return clubs;
    },
    
    memberOwnEvents: async (
      _parent,
      { memberOwnEventsArgs },
      _context,
      _info
    ) => {

      const contact_user = await cacheController.getThroughCacheWithoutHydraMember(
        `${config.config.base_url_resamania}${memberOwnEventsArgs.targetId}`,
        'contact_user'
      );

      const ownEvents = await cacheController.memberOwnEvents(
        `${config.config.base_url_resamania}/everestsportclubbesancon/attendees?contactId=${contact_user.contactId}&page=${memberOwnEventsArgs.page}&state=${memberOwnEventsArgs.state}&order[createdAt]=desc&classEvent.startedAt[strictly_after]=${memberOwnEventsArgs.strictlyAfter}&classEvent.startedAt[strictly_before]=${memberOwnEventsArgs.strictlyBefore}`,
        memberOwnEventsArgs.state == "booked"
          ? `bookedmemberOwnEvent_${memberOwnEventsArgs.page}${memberOwnEventsArgs.strictlyAfter}${memberOwnEventsArgs.strictlyBefore}`
          : memberOwnEventsArgs.state == "canceled"
          ? `canceledmemberOwnEvent_${memberOwnEventsArgs.page}`
          : "memberOwnEvent"
      );
      const memberOwnEventsData = [
        {
          memberOwnEventsList: ownEvents["hydra:member"],
          totalItems: ownEvents["hydra:totalItems"],
        },
      ];
      return memberOwnEventsData;
    },

    classEventById: async (_parent, { eventId }, _context, _info) => {
      const classEventById =
        await cacheController.getThroughCacheWithoutHydraMember(
          `${config.config.base_url_resamania}/everestsportclubbesancon/class_events/${eventId.id}`,
          "classEventReservation_"
        );

      classEventById.id = classEventById["@id"];

      return classEventById;
    },

    subscriptions: async () => {
      // var monobjet_json = localStorage.getItem("MemberData");
      // var monobjet = await JSON.parse(monobjet_json);

      const contact_user = await cacheController.getThroughCacheWithoutHydraMember(
        `${config.config.base_url_resamania}${memberOwnEventsArgs.targetId}`,
        'contact_user'
      );

      const subscriptions = await cacheController.getThroughCache(
        `${config.config.base_url_resamania}/${client_token}/subscriptions?contact=${contact_user.contactId}`,
        "subscriptions_key"
      );
      await subscriptions.map((e) => {
        e.id = e["@id"];
      });
      return subscriptions;
    },
    
    studios: async () => {
      const studios = await cacheController.getThroughCache(
        `${config.config.base_url_resamania}/${client_token}/studios`,
        "studios_key"
      );
      studios.map((e) => {
        e.id = e["@id"];
      });
      return studios;
    },
    activities: async () => {
      const activities = await cacheController.getThroughCache(
        `${config.config.base_url_resamania}/${client_token}/activities`,
        "activities_key"
      );
      activities.map((e) => {
        e.id = e["@id"];
      });
      return activities;
    },
    getAllArticles: async () => {
      return await Article.find();
    },
    getArticleById: async (_parent, { id }, _context, _info) => {
      return Article.findById(id);
    },
    getArticleByType: async (_parent, { type }, _context, _info) => {
      const res = await Article.find();
      return res.filter(
        (article) => article.type === type && article.state === "POSTED"
      );
    },
    getArticleByIsTrend: async (_parent, { isTrend }, _context, _info) => {
      const res = await Article.find();
      return res.filter(
        (article) => article.isTrend === isTrend && article.state === "POSTED"
      );
    },
    events: async () => {
      const events = await cacheController.events(
        `${config.config.base_url_resamania}/everestsportclubbesancon/events?startedAt=${timeController.timeController(
          today
        )}`,
        "events_key"
      );
      return events;
    },
    articlesResamania: async () => {
      const articlesResamania = await cacheController.getThroughCache(
        `${config.config.base_url_resamania}/${client_token}/articles`,
        "article_resamania_key"
      );
      await articlesResamania.map((e) => {
        e.id = e["@id"];
      });
      return articlesResamania;
    },

    getStatContactEverestByState: async () => {
      const res = await ContactEverest.aggregate([
        {
          $group: {
            _id: "$state",

            count: {
              $sum: 1,
            },
          },
        },
        { $sort: { _id: -1 } },
      ]);
      await res.map((e) => {
        e.groupedBy = e._id;
      });
      return res;
    },

    getStatContactEverestBySourceId: async (
      _parent,
      { filter },
      _context,
      _info
    ) => {
      const res = await ContactEverest.aggregate([
        { $match: { state: filter.state } },
        {
          $group: {
            _id: "$sourceId",

            count: {
              $sum: 1,
            },
          },
        },
        { $sort: { _id: -1 } },
      ]);
      await res.map((e) => {
        e.groupedBy = e._id;
      });
      return res;
    },

    getStatContactEverestByDate: async (
      _parent,
      { filter },
      _context,
      _info
    ) => {
      const res = await ContactEverest.aggregate([
        { $match: { state: filter.state } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 7 },
      ]);
      await res.map((e) => {
        e.groupedBy = e._id;
      });
      return res;
    },

    getContactEverest: async (_parent, { filter }, _context, _info) => {
      const filters = {};

      if (filter.searching) {
        const searching = new RegExp(filter.searching, "i");
        filters.$or = [
          { givenName: searching },
          { familyName: searching },
          { email: searching },
        ];
      }
      if (filter.searchMonth) {
        filters.$expr = {
          $eq: [{ $month: "$createdAt" }, parseInt(filter.searchMonth)],
        };
      }
      if (filter.searchDateState === "true") {
        filters.createdAt = {
          $gte: filter.searchDate.split("T")[0] + "T" + "00:00:00.000Z",
          $lt: filter.searchDate.split("T")[0] + "T" + "23:59:59.000Z",
        };
      }

      if (filter.state) {
        filters.$and = [{ state: filter.state.map((k) => k) }];
      }

      if (filter.sourceId) {
        filters.$and = [{ sourceId: filter.sourceId.map((k) => k) }];
      }

      if (filter.state && filter.sourceId) {
        filters.$and = [
          { state: filter.state.map((k) => k) },
          { sourceId: filter.sourceId.map((k) => k) },
        ];
      }

      var skip = Number(filter.page) * 100;
      const res = await ContactEverest.find(filters, undefined, {
        skip,
        limit: 100,
      }).sort({ _id: -1 });
      return res;
    },

    getfiltredEvents: async (_parent, { filter }, _context, _info) => {
      const events = await cacheController.events(
        `${config.config.base_url_resamania}/everestsportclubbesancon/events?startedAt=${timeController.timeController(
          today
        )}`,
        "events_key"
      );
      events.sort(function (a, b) {
        return new Date(a.startedAt) - new Date(b.startedAt);
      });
      return events.filter(
        (event) =>
          (filter.activity_contains
            ? filter.activity_contains.includes(event.activity)
            : event.activity.includes("")) &&
          (filter.studio_contains
            ? filter.studio_contains.includes(event.studio)
            : event.studio.includes("")) &&
          (filter.coach_contains
            ? filter.coach_contains.includes(event.coach)
            : event.coach
            ? event.coach.includes("")
            : null) &&
          (filter.club_contains
            ? filter.club_contains.includes(event.club)
            : event.club.includes("")) &&
          (filter.day_contains
            ? filter.day_contains.includes(
                new Date(event.startedAt)
                  .toLocaleDateString("fr", DATE_SEARCH_OPTIONS_PLANNING)
                  .toUpperCase()
              )
            : days.map(
                (day) =>
                  new Date(event.startedAt)
                    .toLocaleDateString("fr", DATE_SEARCH_OPTIONS_PLANNING)
                    .toUpperCase() == day
              )) &&
          (filter.time_contains
            ? filter.time_contains.includes(
                new Date(event.startedAt).getHours()
              )
            : hours.map(
                (time) => new Date(event.startedAt).getHours() == time
              )) &&
          new Date(timeController.timeController(today)) <
            new Date(event.startedAt) &&
          new Date(endedAt) > new Date(event.startedAt)
      );
    },

    articlesSearch: async (_parent, { title }, _context, _info) => {
      const argument = "title";
      const res = await Article.find();
      return search.inputSearch(res, argument, title);
    },
  },
  Events: {
    activityObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "activities_key",
        parent.activity
      );
    },
    studioObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "studios_key",
        parent.studio
      );
    },
    clubObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "clubs_key",
        parent.club
      );
    },
    coachObject: async (parent) => {
      try {
        const myCache = await cacheController.jsonCache.get("coaches_key");
        return myCache
          ? myCache.find((e) => e.id_resamania_prod === parent.coach)
          : null;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Studio: {
    clubObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "clubs_key",
        parent.club
      );
    },
  },

  MemberOwnEvents: {
    activityObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "activities_key",
        parent.classEvent.activity
      );
    },
    studioObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "studios_key",
        parent.classEvent.studio
      );
    },
    clubObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "clubs_key",
        parent.classEvent.club
      );
    },

    coachObject: async (parent) => {
      try {
        const myCache = await cacheController.jsonCache.get("coaches_key");
        return myCache
          ? myCache.find((e) => e.id_resamania_prod === parent.classEvent.coach)
          : null;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Subscriptions: {
    articleObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "article_resamania_key",
        parent.articleId
      );
    },
  },

  MessageEverest: {
    contactEverest: async (parent) => {
      return ContactEverest.findById(parent.contact);
    },
  },

  ClassEventById: {
    activityObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "activities_key",
        parent.activity
      );
    },
    studioObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "studios_key",
        parent.studio
      );
    },
    clubObject: async (parent) => {
      return cacheController.getElementByIdFromCacheList(
        "clubs_key",
        parent.club
      );
    },

    coachObject: async (parent) => {
      try {
        const myCache = await cacheController.jsonCache.get("coaches_key");
        return myCache
          ? myCache.find((e) => e.id_resamania_prod === parent.coach)
          : null;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Date: {
    __parseValue(value) {
      return new Date(value); // value from the client
    },
    __serialize(value) {
      return value; // value sent to the client
    },
    __parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  },

  Mutation: {
    updateArticle: async (_parent, args) => {
      return Article.findByIdAndUpdate(args.id, args.articleInput);
    },
    deleteArticle: async (_parent, args) => {
      return Article.findByIdAndRemove(args.id);
    },
  },
};
module.exports = resolvers;
