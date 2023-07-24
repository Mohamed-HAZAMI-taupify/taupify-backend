const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
  
  type Events {
    id: String
    attendingLimit: Int
    queueLimit: Int
    activity: String
    studio: String
    club: String
    coach: String
    startedAt: String
    endedAt: String
    activityObject: Activity
    studioObject: Studio
    clubObject: Club
    coachObject: Coach
    bookedAttendees: [Attendees]
    queuedAttendees: [Attendees]
  }

  type Club {
    id: String
    name: String
  }
  type Studio {
    id: String
    name: String
    createdAt: String
    streetAddress: String
    postalCode: String
    addressLocality: String
    addressCountry: String
    club: String
    clubObject: Club
  }
  type Activity {
    id: String
    name: String
    createdAt: String
    durations: [String]
  }
  type Coach {
    _id: ID
    givenName: String
    familyName: String
    alternateName: String
    image: Image
    description: String
    id_resamania_prod: String
    id_resamania: String
    activities: [activities]
    email: String
    phone: Int
    socialmedia: Socialmedia
    date: Date
  }

  type Socialmedia {
    facebook: String
    instagram: String
    youtube: String
  }

  type Attendees {
    contactId: String
    contactGivenName: String
    contactFamilyName: String
    contactNumber: String
    contactClubId: String
    contactDetails: String
    contactCreatedAt: Date
    contactTagUsed: String
    contactCounterUsed: String
    contactPictureId: String
    contactChannelUsed: String
    cancelReason: String
    ##warnings: [String]
    createdAt: Date
    createdBy: String
    canceledAt: Date
    canceledBy: String
    validatedAt: Date
    validatedBy: String
    queuedAt: Date
    queuedBy: String
    deletedAt: Date
    deletedBy: String
    ##state: booked
    state: String
    classEvent: ClassEvent
    costSignIn: Int
    creditSignOut: Int
    bookedItem: String
    showed: Boolean
    attendeeGroup: String
    activityName: String
    classEventStartedAt: Date
    classLayout: String
  }

  type BookedAttendees {
    contactId: String
    state: String
  }

  type ClassEvent {
    club: String
    studio: String
    activity: String
    coach: String
    attendingLimit: Int
    queueLimit: Int
    privateComment: String
    onlineLimit: Int
    startedAt: Date
    endedAt: Date
    defaultOnlineLimit: Int
  }

  type Article {
    id: ID
    type: String
    title: String
    cover: String
    isTrend: Boolean
    state: String
    createdAt: Date
    createdBy: String
  }

  type ArticleResamania {
    id: String
    productName: String
    offerName: String
    priceTE: Int
    priceTI: Int
    tax: Int
    taxRate: Int
  }

  type InitialInfo {
    offerName: String
  }

  type Subscriptions {
    id: String
    name: String
    validFrom: String
    inclusiveValidThrough: String
    articleId: String
    articleObject: ArticleResamania
    initialInfo: InitialInfo
  }

  type Image {
    _url: String
  }

  type activities {
    label: String
    value: String
  }

  type EventMember {
    memberOwnEventsList: [MemberOwnEvents]
    totalItems: Int
  }

  type MemberOwnEvents {
    id: String
    activityName: String
    contactId: String
    classEvent: ClassEvent
    state: String
    activityObject: Activity
    studioObject: Studio
    clubObject: Club
    coachObject: Coach
  }

  input SearchInput {
    title: String
  }

  input EventFilter {
    activity_contains: [String]
    studio_contains: [String]
    coach_contains: [String]
    club_contains: [String]
    day_contains: [String]
    time_contains: [Int]
  }

  input CoachFilter {
    activity_contains: [String]
  }

  input BackOfficeFilter {
    searching: String
    searchMonth: String
    searchDateState: Boolean
    searchDate: String
  }

  input MemberOwnEventsArgs {
    page: Int
    state: String
    strictlyAfter: String
    strictlyBefore: String
    targetId: String

  }

  type ClassEventById {
    id: String
    attendingLimit: Int
    queueLimit: Int
    activity: String
    studio: String
    club: String
    coach: String
    startedAt: String
    endedAt: String
    activityObject: Activity
    studioObject: Studio
    clubObject: Club
    coachObject: Coach
    bookedAttendees: [BookedAttendees]
    queuedAttendees: [BookedAttendees]
  }

  type ContactEverest {
    id: ID
    familyName: String
    givenName: String
    email: String
    subscribe: String
    mobile: String
    sourceId: String
    createdAt: Date
    state: String
  }

  type MessageEverest {
    id: ID
    contactEverest: ContactEverest
    email: String
    message: [String]
    date: Date
  }

  type StatContactEverestGroupedBy {
    groupedBy: String
    count: Int
  }

  input ContactEverestFilter {
    state: [String]
    sourceId: [String]
    searching: String
    searchMonth: String
    searchDateState: Boolean
    searchDate: String
    page: Int
  }

  input EventId {
    id: String
  }

  input StateFilter {
    state: String
  }

  input ArticleInput {
    id: ID
    type: String
    title: String
    cover: String
    isTrend: Boolean
    state: String
    createdAt: Date
    createdBy: String
  }

  type Mutation {
    updateArticle(id: ID, articleInput: ArticleInput): Article
    deleteArticle(id: ID): Article
  }

  type Query {
    clubs: [Club]
    studios: [Studio]
    activities: [Activity]
    coaches: [Coach]
    memberOwnEvents(memberOwnEventsArgs: MemberOwnEventsArgs): [EventMember!]!
    getArticleByType(type: String): [Article]
    getArticleById(id: ID): Article
    getStudios: [Studio]
    getAllActivities: [Activity]
    getAllCoaches: [Coach]
    getMemberOwnEvents: [MemberOwnEvents]
    getArticleByIsTrend(isTrend: Boolean): [Article]
    events: [Events]
    articlesSearch(title: String): [Article]
    getAllArticles: [Article]
    getfiltredEvents(filter: EventFilter): [Events!]!
    articlesResamania: [ArticleResamania]
    subscriptions: [Subscriptions]
    getfiltredCoaches(filter: CoachFilter): [Coach!]!
    classEventById(eventId: EventId): ClassEventById
    getBackOfficeCoaches(filter: BackOfficeFilter): [Coach!]!
    getBackOfficeActivities(filter: BackOfficeFilter): [Activity]
    getBackOfficeStudios(filter: BackOfficeFilter): [Studio]
    getContactEverest(filter: ContactEverestFilter): [ContactEverest]
    getMessagesEverest(filter: BackOfficeFilter): [MessageEverest]
    getStatContactEverestByState: [StatContactEverestGroupedBy]
    getStatContactEverestBySourceId(filter: StateFilter): [StatContactEverestGroupedBy]
    getStatContactEverestByDate(filter: StateFilter): [StatContactEverestGroupedBy]
  }
`;
module.exports = typeDefs;
