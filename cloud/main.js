console.log('Cloud code connected');

// // #TODO move to config
// const DEEPLINKS_API_NAME = "CAMPFIRE";
// const XR_AUTH_URL = "CAMPFIRE";
// const DEFAULT_DEEPLINK_URL = "https://app.mural.co/";
// const DEFAULT_SCENE_ID = "WildernessCamp2d0Scene";
// const DEFAULT_WORLD_ID = "WZEBnjBgtl";

// const SCENE_IDS = [
//   "LobbyScene",
//   "NewCampFireScene",
//   "WildernessCamp2d0Scene",
//   "CampFireScene",
//   "ThreeSixtyPhotoSphereScene",
//   "PassthroughTestScene",
//   "InworldNpcScene",
// ];

// // Config
// const MURAL_WIDTH = 600;
// const MURAL_HEIGHT = 600;
// const GAP = 10;
// const CLEAN_UP_PASS_CODE = "1337";
// const SALT_ROUNDS = 10;
// const CHISEL_MODEL_PREFIX = "ct____u_MQvrDBdhbX__MURAL_VR_Manager____";
// const {
//   MURAL_HOST,
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI,
//   SCOPE,
//   REDIRECT_URI_XR,
//   OCULUS_APP_ID,
//   OCULUS_ACCESS_TOKEN,
// } = process.env;
// const models = {
//   inventory: "Inventory",
//   vrFiles: "VrFiles",
//   room: "Room",
//   roomMembers: "RoomMembers",
//   staredRooms: "StaredRooms",
//   staredAssets: "StaredAssets",
//   roomObjects: "RoomObjects",
//   pair: "PairCode",
//   deepLinks: "DeepLinks",
//   whitelist: "OculusUsersWhiteList",
//   pairedDevices: "PairedDevices",
//   assets: `${CHISEL_MODEL_PREFIX}Asset`,
//   world: `${CHISEL_MODEL_PREFIX}World`,
//   vrSession: "VrSession",
//   vrAppInfo: "VrAppInfo",
// };

// //CORE PART

// /**
//  * This function creates entity
//  * @param {string} modelName Name of db model see 'models' const
//  * @param {Object} params Conditions for db, example: {objectId: '123123'}
//  * @returns {Promise<Object>} Entity
//  */
// const createEntity = async (modelName, params) => {
//   const entityToCreate = new Parse.Object(modelName);
//   Object.entries(params).forEach(([key, value]) => {
//     entityToCreate.set(key, value);
//   });
//   await entityToCreate.save();
//   return entityToCreate;
// };

// /**
//  * This function fetches entities or entity from db by params
//  * @param {string} modelName Name of db model see 'models' const
//  * @param {Object} equalTo Conditions for db, example: {objectId: '123123'}
//  * @param {Object} notEqualTo Exclude conditions for db, example: {objectId: '123123'}
//  * @param {string[]} includeFields Array of fields which need to include
//  * @param {boolean} findAll This prop enables batch fetch
//  * @param {boolean} withMasterKey Master key needs for fetching sensitive fields, don't use it
//  * @param {string} sortBy Sorting ascending/descending
//  * @param {string} sortKey Sorting key
//  * @param {string} limit Limit
//  * @returns {Promise<Array | Object>} Object or Array of entities
//  */
// const findEntities = (
//   modelName,
//   equalTo,
//   notEqualTo = {},
//   includeFields = [],
//   findAll = false,
//   withMasterKey = false,
//   sortBy = "descending",
//   sortKey = "updatedAt",
//   limit
// ) => {
//   const query = new Parse.Query(modelName);
//   includeFields.forEach((inc) => {
//     query.include(inc);
//   });
//   Object.entries(equalTo).forEach(([key, value]) => {
//     query.equalTo(key, value);
//   });

//   Object.entries(notEqualTo).forEach(([key, value]) => {
//     query.notEqualTo(key, value);
//   });

//   query.containedIn;

//   if (sortBy === "descending") {
//     query.descending([sortKey]);
//   }
//   if (sortBy === "ascending") {
//     query.ascending([sortKey]);
//   }
//   if (limit) {
//     query.limit(limit);
//   }

//   return findAll
//     ? query.find({ useMasterKey: withMasterKey })
//     : query.first({ useMasterKey: withMasterKey });
// };
// // END CORE PART

// /**
//  * This function creates vr room
//  * @param {string} worldId - Id of vr World
//  * @param {string} name - Name of the room
//  * @param {string} userId - Id of room creator
//  */
// const createVrRoom = async (worldId, name, userId) => {
//   try {
//     const vrRoom = await createEntity(models.room, {
//       creator: {
//         objectId: userId,
//         __type: "Pointer",
//         className: "_User",
//       },
//       world: {
//         objectId: worldId,
//         __type: "Pointer",
//         className: models.world,
//       },
//       name,
//     });

//     return vrRoom._getId();
//   } catch (error) {
//     throw error;
//   }
// };
// const createDeepLinkRecord = async (params) => {
//   const { roomId, muralId, deepLink, sceneId, vrRoomId, muralUrl, code } =
//     params;
//   try {
//     const createParams = {
//       roomId,
//       muralId,
//       deepLink,
//       sceneId,
//       muralUrl,
//       vrRoomId: {
//         objectId: vrRoomId,
//         __type: "Pointer",
//         className: models.room,
//       },
//     };
//     if (code) {
//       createParams.code = code;
//     }
//     return createEntity(models.deepLinks, createParams);
//   } catch (e) {
//     throw e;
//   }
// };

// /**
//  * This function creates deeplink using meta API
//  * @param {string} apiName - Value from configs BY DEFAULT 'CAMPFIRE'
//  * @param {string} roomId - Id of mural board
//  * @param {string} muralLink - Link to mural board
//  * @param {string} sceneId - From config varible 'SCENE_IDS'
//  * @param {boolean} isFacilitator - Is facilitator
//  * @param {string} vrRoom - ID of vr room
//  * @param {string} isTutorial - Is tutorial
//  */
// const generateDeeplink = async (params) => {
//   const {
//     apiName,
//     roomId,
//     muralLink,
//     sceneId,
//     isFacilitator,
//     vrRoom,
//     isTutorial,
//   } = params;

//   let messageData = {
//     RoomID: roomId,
//     MuralUrl: muralLink,
//     clientId: CLIENT_ID,
//     SceneID: sceneId,
//     IsFacilitator: isFacilitator,
//     vrRoom,
//     isTutorial,
//   };

//   const message = JSON.stringify(messageData);
//   const url = `https://graph.oculus.com/${OCULUS_APP_ID}/app_deeplink_public?access_token=${OCULUS_ACCESS_TOKEN}&destination_api_name=${apiName}&valid_for=0&deeplink_message_override=${message}&fields=url`;
//   let code;

//   try {
//     const { data } = await axios({
//       method: "POST",
//       url,
//     });
//     code = await generateUniqueCode(models.deepLinks, "code");
//     await createDeepLinkRecord({
//       code,
//       roomId,
//       muralId: roomId,
//       deepLink: data.url,
//       sceneId,
//       vrRoomId: vrRoom,
//       muralUrl: muralLink,
//     });
//     return {
//       sceneId,
//       code,
//       url: data.url,
//       id: data.id,
//       debugUrl: url,
//     };
//   } catch (e) {
//     throw new Error(`${e.message} : ${url}`);
//   }
// };

// /**
//  * This function removes temporary user by oculusName excluding permanentUserId
//  * @param {string} permanentUserId - Id of user which shouldn't be removed
//  * @param {string} oculusName - Oculus name
//  */
// const removeTemporaryUsers = async (permanentUserId, oculusName) => {
//   const destroyTasks = [];
//   const tempUsers = await findEntities(
//     "_User",
//     {
//       oculusName,
//       type: "temporary",
//     },
//     { objectId: permanentUserId },
//     [],
//     true,
//     true
//   );

//   for (const u of tempUsers) {
//     destroyTasks.push(u.destroy({ useMasterKey: true }));
//   }

//   await Promise.all(destroyTasks);
// };

// // Logs & error handling
// const prepareAxiosErrorMessage = (error, additionalMessage) =>
//   `${error.response.data.error_description || error.message} ${
//     additionalMessage ? additionalMessage : ""
//   }`;
// const logError = (endpoint, message) => {
//   console.error(`Error in ${endpoint}:${message}`);
// };

// const handleAxiosError = (endpoint, error) => {
//   logError(endpoint, prepareAxiosErrorMessage(error));
//   return {
//     status: "error",
//     error: prepareAxiosErrorMessage(error),
//   };
// };
// const handleError = (endpoint, error) => {
//   logError(endpoint, `${error.message}:${error.stack}`);
//   return {
//     status: "error",
//     error: error.message,
//   };
// };

// // Token
// const getFreshToken = async (refreshToken) => {
//   try {
//     const url = `https://${MURAL_HOST}/api/public/v1/authorization/oauth2/refresh`;
//     const params = {
//       refresh_token: refreshToken,
//       grant_type: "refresh_token",
//       scope: SCOPE,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//     };
//     const res = await axios.post(url, params, {
//       headers: {
//         "content-type": "application/json",
//         Accept: "application/json",
//       },
//     });
//     return res.data;
//   } catch (error) {
//     throw new Error(error.response.data.error_description);
//   }
// };

// const isTokenExpired = (token) => {
//   const result = jwt_decode(token);
//   if (result && result.exp) {
//     if (Date.now() < result.exp * 1000) {
//       return false;
//     }
//   }
//   return true;
// };

// const getMuralToken = async (user) => {
//   try {
//     const userData = user.toJSON();
//     let token;
//     if (userData.authData && userData.authData.mural.accessToken) {
//       token = userData.authData.mural.accessToken;
//       if (isTokenExpired(token)) {
//         const tokens = await getFreshToken(
//           userData.authData.mural.refreshToken
//         );
//         token = tokens.access_token;
//         await user.save(
//           {
//             authData: {
//               ...userData.authData,
//               mural: {
//                 ...userData.authData.mural,
//                 accessToken: tokens.access_token,
//                 refreshToken: tokens.refresh_token,
//               },
//             },
//           },
//           { useMasterKey: true }
//         );
//       }
//     }
//     if (!token) {
//       throw new Error(`Can't find the mural auth token`);
//     }

//     return token;
//   } catch (e) {
//     throw e;
//   }
// };

// // Mural endpoints

// const mutalCreateWidget = (token, muralId, widgetType, params) => {
//   console.log(`Started ${widgetType} creation task (${token}, ${muralId})`);
//   axios.post(
//     `https://${MURAL_HOST}/api/public/v1/murals/${muralId}/widgets/${widgetType}`,
//     params,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };
// const muralPublicMe = async (token) => {
//   try {
//     const res = await axios.get(
//       `https://${MURAL_HOST}/api/public/v1/users/me`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     return res.data;
//   } catch (error) {
//     throw new Error(prepareAxiosErrorMessage(error));
//   }
// };

// const muralInternalMe = async (token) => {
//   try {
//     const res = await axios.get(`https://${MURAL_HOST}/api/v0/user/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     return res.data;
//   } catch (error) {
//     throw new Error(prepareAxiosErrorMessage(error));
//   }
// };

// const getMuralDimension = (muralId, token) => {
//   return [MURAL_WIDTH, MURAL_HEIGHT];
// };
// const prepateMuralText = (left, top, text, fontSize = 12, rotation = 0) => {
//   const width = fontSize * text.length;
//   const height = fontSize;
//   return {
//     width,
//     height,
//     rotation,
//     title: text,
//     x: left - width / 2,
//     y: top - height / 2,
//     style: {
//       textAlign: "center",
//       fontSize,
//     },
//     text,
//   };
// };
// const prepareMuralArrowObject = (points, strokeStyle = "solid") => ({
//   presentationIndex: -1,
//   arrowType: "straight",
//   stackable: true,
//   style: {
//     strokeStyle,
//     strokeWidth: 1,
//     strokeColor: "#D60057FF",
//   },
//   tip: "no tip",
//   points,
//   width: 1,
//   height: 1,
//   x: 0,
//   y: 0,
// });
// const createMuralStickesTasks = (muralId, token, stickyObjects) => {
//   return [
//     (() =>
//       mutalCreateWidget(token, muralId, "sticky-note", stickyObjects)).bind(
//       this
//     ),
//   ];
// };

// const calcMuralStickyLeft = (index, unitWidth) => {
//   return unitWidth * (index - 1) + GAP * index;
// };

// const calcMuralStickyTop = (index, unitHeight) => {
//   return unitHeight * (index - 1) + GAP * index;
// };

// const calcMuralStickyWidth = (boxWidth, dataLength) => {
//   return (boxWidth - (dataLength + 1) * GAP) / dataLength;
// };
// const calcMuralStickyHeight = (boxHeight, dataLength) => {
//   return (boxHeight - (dataLength + 1) * GAP) / dataLength;
// };

// const convertToMuralSticky = (
//   text,
//   priorityIndex,
//   effectIndex,
//   unitWidth,
//   unitHeight
// ) => {
//   const x = calcMuralStickyLeft(priorityIndex, unitWidth);
//   const y = calcMuralStickyTop(effectIndex, unitHeight);
//   return {
//     width: unitWidth,
//     height: unitHeight,
//     title: text,
//     text,
//     shape: "rectangle",
//     x,
//     y,
//     style: {
//       textAlign: "center",
//     },
//   };
// };
// // Assumed matrix data format [
// //   { content: 'Item 1', priorityScore: 5, effectScore: 8 },
// //   { content: 'Item 2', priorityScore: 3, effectScore: 6 },
// //   ...
// // ];

// const getStickiesData = (matrixData, boxWidth, boxHeight) => {
//   // Sort the data based on priorityScore and effectScore
//   const sortedDataByPriority = matrixData
//     .slice()
//     .sort((a, b) => a.priorityScore - b.priorityScore);
//   const sortedDataByEffect = matrixData
//     .slice()
//     .sort((a, b) => a.effectScore - b.effectScore);

//   const dataLength = matrixData.length;
//   const unitWidth = calcMuralStickyWidth(boxWidth, dataLength);
//   const unitHeight = calcMuralStickyHeight(boxHeight, dataLength);

//   // Add the order index of priorityScore and effectScore and mural sticky x, y position.
//   const stickies = matrixData.map((item) => {
//     const priorityIndex =
//       sortedDataByPriority.findIndex((el) => el === item) + 1;
//     const effectIndex = sortedDataByEffect.findIndex((el) => el === item) + 1;
//     return convertToMuralSticky(
//       item.content,
//       priorityIndex,
//       effectIndex,
//       unitWidth,
//       unitHeight
//     );
//   });
//   return stickies;
// };

// const createAxisesTasks = (muralId, token, boxWidth, boxHeight) => {
//   const tasksWithTimeout = [];
//   const xAxisPoints = [
//     { x: 0, y: boxHeight },
//     { x: boxWidth, y: boxHeight },
//   ];
//   const yAxisPoints = [
//     { x: 0, y: 0 },
//     { x: 0, y: boxHeight },
//   ];
//   const topBorderPoints = [
//     { x: 0, y: 0 },
//     { x: boxWidth, y: 0 },
//   ];
//   const rightBorderPoints = [
//     { x: boxWidth, y: 0 },
//     { x: boxWidth, y: boxHeight },
//   ];
//   const horizontalCenterLinePoints = [
//     { x: 0, y: boxHeight / 2 },
//     { x: boxWidth, y: boxHeight / 2 },
//   ];
//   const verticalMiddleLinePoints = [
//     { x: boxWidth / 2, y: 0 },
//     { x: boxWidth / 2, y: boxHeight },
//   ];
//   const quadrantLabelFontSize = Math.round((16 * boxWidth) / MURAL_WIDTH);
//   const axisLabelFontSize = Math.round(quadrantLabelFontSize / 2);
//   const yAxisText = "Relative Difficulty / Cost";
//   const xAxisText = "Impact / importance";
//   const lowHighFontSize = 16;
//   const muralArrows = [
//     prepareMuralArrowObject(xAxisPoints),
//     prepareMuralArrowObject(yAxisPoints),
//     prepareMuralArrowObject(topBorderPoints, "dotted-spaced"),
//     prepareMuralArrowObject(rightBorderPoints, "dotted-spaced"),
//     prepareMuralArrowObject(horizontalCenterLinePoints, "dotted-spaced"),
//     prepareMuralArrowObject(verticalMiddleLinePoints, "dotted-spaced"),
//   ];
//   const muralTextWidgets = [
//     prepateMuralText(
//       boxWidth / 4,
//       boxHeight / 4,
//       "Lower ROI",
//       quadrantLabelFontSize
//     ),
//     prepateMuralText(
//       (boxWidth * 3) / 4,
//       boxHeight / 4,
//       "Strategic Ideas",
//       quadrantLabelFontSize
//     ),
//     prepateMuralText(
//       boxWidth / 4,
//       (boxHeight * 3) / 4,
//       "Lower Hanging Fruit",
//       quadrantLabelFontSize
//     ),
//     prepateMuralText(
//       (boxWidth * 3) / 4,
//       (boxHeight * 3) / 4,
//       "Higher ROI",
//       quadrantLabelFontSize
//     ),
//     prepateMuralText(
//       (yAxisText.length * axisLabelFontSize) / 2 - 50,
//       boxHeight / 2 + (axisLabelFontSize / 2) * yAxisText.length,
//       yAxisText,
//       axisLabelFontSize,
//       270
//     ),
//     prepateMuralText(
//       boxWidth / 2,
//       boxHeight + 50,
//       xAxisText,
//       axisLabelFontSize
//     ),
//     prepateMuralText(-15, boxHeight - 50, "Low", lowHighFontSize, 270),
//     prepateMuralText(-15, 50, "High", lowHighFontSize, 270),
//     prepateMuralText(10, boxHeight + 20, "Low", lowHighFontSize),
//     prepateMuralText(boxWidth - 50, boxHeight + 20, "High", lowHighFontSize),
//   ];
//   tasksWithTimeout.push(
//     (() => mutalCreateWidget(token, muralId, "textbox", muralTextWidgets)).bind(
//       this
//     )
//   );

//   muralArrows.forEach((arrowWidget) => {
//     tasksWithTimeout.push(
//       (() => mutalCreateWidget(token, muralId, "arrow", arrowWidget)).bind(this)
//     );
//   });

//   return tasksWithTimeout;
// };

// const getTemporaryUsersByOculusName = async (oculusNameId) => {
//   const tempUsers = await findEntities(
//     "_User",
//     {
//       oculusName: oculusNameId,
//       type: "temporary",
//     },
//     {},
//     [],
//     true,
//     true
//   );
//   const usrs = [];
//   for (const tmpUser of tempUsers) {
//     const tmp = tmpUser.toJSON();
//     usrs.push(tmp.objectId);
//   }
//   return usrs;
// };

// const moveVrFiles = async (tempUserId, destinationUserId) => {
//   try {
//     const files = await findEntities(
//       models.vrFiles,
//       {
//         owner: {
//           objectId: tempUserId,
//           __type: "Pointer",
//           className: "_User",
//         },
//       },
//       {},
//       [],
//       true
//     );
//     for (const fileVr of files) {
//       fileVr.set("owner", {
//         objectId: destinationUserId,
//         __type: "Pointer",
//         className: "_User",
//       });
//       await fileVr.save();
//     }
//   } catch (e) {
//     throw new Error(`Problem with migrating vr files ${e.message}`);
//   }
// };

// const moveVrRooms = async (tempUserId, destinationUserId) => {
//   try {
//     const rooms = await findEntities(
//       models.room,
//       {
//         creator: {
//           objectId: tempUserId,
//           __type: "Pointer",
//           className: "_User",
//         },
//       },
//       {},
//       [],
//       true
//     );
//     for (const room of rooms) {
//       room.set("creator", {
//         objectId: destinationUserId,
//         __type: "Pointer",
//         className: "_User",
//       });
//       await room.save();
//     }
//   } catch (e) {
//     throw new Error(`Problem with migrating rooms ${e.message}`);
//   }

//   try {
//     // move all room memebers
//     const roomMembers = await findEntities(
//       models.roomMembers,
//       {
//         user: {
//           objectId: tempUserId,
//           __type: "Pointer",
//           className: "_User",
//         },
//       },
//       {},
//       [],
//       true
//     );
//     for (const member of roomMembers) {
//       member.set("user", {
//         objectId: destinationUserId,
//         __type: "Pointer",
//         className: "_User",
//       });
//       await member.save();
//     }
//   } catch (e) {
//     throw new Error(`Problem with migrating room members ${e.message}`);
//   }
// };

// const proceedMigration = async (tempUserId, destinationUserId) => {
//   await Promise.all([
//     moveVrFiles(tempUserId, destinationUserId),
//     moveVrRooms(tempUserId, destinationUserId),
//   ]);
// };

// const moveStuffToPermanentUser = async (oculusNameId, destinationUserId) => {
//   const tempUsers = await getTemporaryUsersByOculusName(oculusNameId);
//   for (const u of tempUsers) {
//     await proceedMigration(u, destinationUserId);
//   }
// };

// const rndNum = (length) => {
//   let result = "";
//   const characters = "0123456789";
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// };

// const generateUniqueCode = async (modelName, fieldCodeKey, digitsCount = 6) => {
//   const query = new Parse.Query(modelName);
//   let count = 0;
//   let code = "";
//   do {
//     code = rndNum(digitsCount);
//     query.equalTo(fieldCodeKey, code);
//     count = await query.count();
//   } while (count > 0);

//   return code;
// };

// const mapMuralUser = (keys, userJsonObj) => {
//   const user = {};
//   if (userJsonObj.authData) {
//     if (userJsonObj.authData.mural) {
//       for (const k of keys) {
//         user[k] = userJsonObj.authData.mural[k];
//       }
//       user["id"] = userJsonObj["objectId"];

//       return user;
//     }
//   }
//   console.log("test message");
//   return {
//     avatar:
//       "https://lh3.googleusercontent.com/a/ALm5wu0VBGoK73VHJ7ZsNwRzQeG20RozHbGRwOVPk5lt=s96-c",
//     firstName: "N/a",
//     lastName: "",
//   };
// };

// const mapAssetFile = (assetJsonObj) => {
//   if (assetJsonObj) {
//     return {
//       id: assetJsonObj.objectId,
//       name: assetJsonObj.name,
//       fileUrl: assetJsonObj.file.url,
//       type: assetJsonObj.type,
//       size: assetJsonObj.size,
//     };
//   }
//   return null;
// };

// const mapAsset = (assetObject) => {
//   if (assetObject) {
//     return {
//       id: assetObject._getId(),
//       keyImage: assetObject.get("Key_Image")
//         ? assetObject.get("Key_Image").toJSON().file.url
//         : null,
//       description: assetObject.get("Description")
//         ? assetObject.get("Description")
//         : null,
//       name: assetObject.get("Name") ? assetObject.get("Name") : null,
//       slug: assetObject.get("Slug") ? assetObject.get("Slug") : null,
//       assetFile: assetObject.get("Asset_File")
//         ? mapAssetFile(assetObject.get("Asset_File").toJSON())
//         : null,
//       author: assetObject.get("Author")
//         ? assetObject.get("Author")[0].toJSON().Name
//         : null,
//       userOwner: assetObject.get("userOwner")
//         ? mapMuralUser(
//             ["avatar", "firstName", "lastName"],
//             assetObject.get("userOwner").toJSON()
//           )
//         : null,
//       updatedAt: assetObject.updatedAt.toJSON(),
//       createdAt: assetObject.createdAt.toJSON(),
//     };
//   } else {
//     return undefined;
//   }
// };

// const mapVrFile = (vrFileObj) => {
//   return {
//     id: vrFileObj._getId(),
//     owner: vrFileObj.get("owner")
//       ? mapMuralUser(
//           ["avatar", "firstName", "lastName"],
//           vrFileObj.get("owner").toJSON()
//         )
//       : null,
//     asset: vrFileObj.get("asset") ? vrFileObj.get("asset") : null,
//     name: vrFileObj.get("name") ? vrFileObj.get("name") : null,
//     type: vrFileObj.get("type") ? vrFileObj.get("type") : null,
//     updatedAt: vrFileObj.updatedAt.toJSON(),
//     createdAt: vrFileObj.createdAt.toJSON(),
//   };
// };
// Parse.Cloud.define("cleanupobjects", async (request) => {
//   try {
//     const { code } = request.params;

//     if (code !== CLEAN_UP_PASS_CODE) {
//       throw new Error("Wrong pass code");
//     }

//     const query = new Parse.Query(models.roomObjects);
//     query.equalTo("WorldPositionY", -100);
//     const results = await query.find({ useMasterKey: true });
//     const result = [];

//     for (const obj of results) {
//       result.push(obj._getId());
//       obj.destroy();
//     }

//     return { status: "success", result };
//   } catch (error) {
//     console.log("error in cleanupobjects", error);
//     return {
//       status: "error",
//       error: error.toString(),
//       errorObject: JSON.stringify(error),
//     };
//   }
// });

// Parse.Cloud.define("refresh", async (request) => {
//   try {
//     const { refreshToken } = request.params;
//     const url = `https://${MURAL_HOST}/api/public/v1/authorization/oauth2/refresh`;
//     const params = {
//       refresh_token: refreshToken,
//       grant_type: "refresh_token",
//       scope: SCOPE,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//     };
//     const res = await axios.post(url, params, {
//       headers: {
//         "content-type": "application/json",
//         Accept: "application/json",
//       },
//     });
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/refresh", error);
//   }
// });

// Parse.Cloud.define(
//   "createPriorityMatrix",
//   async (request) => {
//     const { user } = request;
//     try {
//       const { muralId, matrixData } = request.params;
//       const token = await getMuralToken(user);
//       const [boxWidth, boxHeight] = getMuralDimension(muralId, token);
//       const width = request.params.width ? request.params.width : boxWidth;
//       const height = request.params.height ? request.params.height : boxHeight;
//       const axisesTasks = createAxisesTasks(muralId, token, width, height);
//       const stickiesData = getStickiesData(matrixData, width, height);
//       const createStickiesTasks = createMuralStickesTasks(
//         muralId,
//         token,
//         stickiesData
//       );

//       [...axisesTasks, ...createStickiesTasks].forEach((task) => {
//         setTimeout(task, 1500);
//       });
//       return { success: true };
//     } catch (error) {
//       console.error("Error in createPriorityMatrix", error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   },
//   {
//     requireUser: true,
//     fields: ["muralId", "matrixData"],
//   }
// );

// Parse.Cloud.define("token", async (request) => {
//   try {
//     const { code, isXR } = request.params;
//     const url = `https://${MURAL_HOST}/api/public/v1/authorization/oauth2/token`;
//     const params = {
//       code,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       grant_type: "authorization_code",
//       redirect_uri: isXR ? REDIRECT_URI_XR : REDIRECT_URI,
//     };
//     const res = await axios.post(url, params, {
//       headers: {
//         "content-type": "application/json",
//         Accept: "application/json",
//       },
//     });
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/token", error);
//   }
// });

// Parse.Cloud.define("me", async (request) => {
//   try {
//     const { token } = request.params;
//     return { status: "success", result: await muralPublicMe(token) };
//   } catch (error) {
//     return handleError("/me", error);
//   }
// });

// Parse.Cloud.define(
//   "mural-login",
//   async (request) => {
//     try {
//       const { token } = request.params;
//       await muralPublicMe(token);
//       let user;
//       // Check for existing user with email given from `token` request response
//       const userQuery = new Parse.Query("User");
//       userQuery.equalTo("email", email);
//       user = await userQuery.first();
//       const oldId = user ? user.id : null;

//       if (!user) user = new Parse.User();
//       await user.linkWith("mural", { authData }, { useMasterKey: true });

//       // set username and email for the new user
//       if (!oldId) {
//         await user.save(
//           {
//             username: email,
//             email: email,
//           },
//           { useMasterKey: true }
//         );
//       }

//       return { status: "success", result: user };
//     } catch (error) {
//       return handleError("/mural-login", error);
//     }
//   },
//   { fields: ["token", "refreshToken"] }
// );

// Parse.Cloud.define("getAllMurals", async (request) => {
//   try {
//     const { token } = request.params;
//     const res = await axios.get(`https://${MURAL_HOST}/api/public/v1/murals`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/getAllMurals", error);
//   }
// });

// Parse.Cloud.define("getAllWorkspaces", async (request) => {
//   try {
//     const { token } = request.params;
//     const res = await axios.get(
//       `https://${MURAL_HOST}/api/public/v1/workspaces`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/getAllWorkspaces", error);
//   }
// });

// Parse.Cloud.define("getMuralsByRoom", async (request) => {
//   try {
//     const { token, workspaceId, roomId } = request.params;
//     const res = await axios.get(
//       `https://${MURAL_HOST}/api/public/v1/rooms/${roomId}/murals`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/getMuralsByRoom", error);
//   }
// });

// Parse.Cloud.define("createMural", async (request) => {
//   try {
//     const { token, title, workspaceId, roomId } = request.params;
//     const url = `https://${MURAL_HOST}/api/public/v1/murals`;
//     const params = {
//       title,
//       workspaceId,
//       roomId,
//     };
//     const res = await axios.post(url, params, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "content-type": "application/json",
//         Accept: "application/json",
//       },
//     });
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/createMural", error);
//   }
// });

// Parse.Cloud.define("getAllRooms", async (request) => {
//   try {
//     const { token, workspaceId } = request.params;
//     const url = `https://${MURAL_HOST}/api/public/v1/workspaces/${workspaceId}/rooms`;
//     const res = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/getAllRooms", error);
//   }
// });

// Parse.Cloud.define("getWorkspaceById", async (request) => {
//   try {
//     const { token, workspaceId } = request.params;
//     const url = `https://${MURAL_HOST}/api/public/v1/workspaces/${workspaceId}`;
//     const res = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return { status: "success", result: res.data };
//   } catch (error) {
//     return handleAxiosError("/getWorkspaceById", error);
//   }
// });
// Parse.Cloud.define("getCurrentUser", async (request) => {
//   try {
//     const { token } = request.params;
//     return { status: "success", result: await muralPublicMe(token) };
//   } catch (error) {
//     return handleError("/getCurrentUser", error);
//   }
// });

// Parse.Cloud.define("assets", async (request) => {
//   try {
//     const assets = await findEntities(
//       models.assets,
//       {
//         t__status: "Published",
//       },
//       {},
//       [
//         "Asset_File",
//         "Key_Image",
//         "userOwner",
//         ["Author"],
//         ["Worlds"],
//         ["Metadata"],
//       ],
//       true,
//       true
//     );
//     const lst = [];

//     for (const assetObject of assets) {
//       lst.push(mapAsset(assetObject));
//     }

//     return { result: lst, status: "success" };
//   } catch (error) {
//     return handleError("/assets", error);
//   }
// });

// Parse.Cloud.define(
//   "vr-file",
//   async (request) => {
//     try {
//       const { user } = request;
//       const { type } = request.params;

//       const findParams = {
//         owner: {
//           objectId: user.id,
//           __type: "Pointer",
//           className: "_User",
//         },
//       };

//       if (type) {
//         findParams.type = type;
//       }

//       const vrFiles = await findEntities(
//         models.vrFiles,
//         findParams,
//         {},
//         ["asset", "owner"],
//         true,
//         true
//       );

//       const lst = [];

//       for (const vrFile of vrFiles) {
//         lst.push(mapVrFile(vrFile));
//       }

//       return { result: lst, status: "success" };
//     } catch (error) {
//       return handleError("/vr-file", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "stared-assets",
//   async (request) => {
//     try {
//       const { user } = request;
//       const { populate } = request.params;
//       const includeFields = [];
//       const lst = [];

//       if (populate) {
//         includeFields.push("asset.Asset_File");
//         includeFields.push("asset.Key_Image");
//         includeFields.push("asset.userOwner");
//       }
//       const staredAssets = await findEntities(
//         models.staredAssets,
//         {
//           user: {
//             objectId: user.id,
//             __type: "Pointer",
//             className: "_User",
//           },
//           stared: true,
//         },
//         {},
//         includeFields,
//         true,
//         true
//       );

//       for (const staredAsset of staredAssets) {
//         populate
//           ? lst.push(mapAsset(staredAsset.get("asset")))
//           : lst.push(staredAsset.get("asset").toJSON().objectId);
//       }

//       return { result: lst, status: "success" };
//     } catch (error) {
//       return handleError("/stared-assets", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "star-asset",
//   async (request) => {
//     try {
//       const { user } = request;
//       let { assetId, stared } = request.params;

//       const query = new Parse.Query(models.staredAssets);
//       query.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       query.equalTo("asset", {
//         objectId: assetId,
//         __type: "Pointer",
//         className: models.assets,
//       });

//       const result = await query.first({ useMasterKey: true });

//       stared = !!stared;
//       if (result) {
//         result.set("stared", !stared);
//         await result.save();
//       } else {
//         const staredObj = new Parse.Object(models.staredAssets);
//         staredObj.set("user", {
//           objectId: user.id,
//           __type: "Pointer",
//           className: "_User",
//         });
//         staredObj.set("stared", !stared);
//         staredObj.set("asset", {
//           objectId: assetId,
//           __type: "Pointer",
//           className: models.assets,
//         });
//         await staredObj.save();
//       }

//       return { result: { result: stared }, status: "success" };
//     } catch (error) {
//       return handleError("/star-assets", error);
//     }
//   },
//   {
//     fields: ["assetId", "stared"],
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "inventory",
//   async (request) => {
//     try {
//       const { user } = request;

//       const query = new Parse.Query(models.inventory);
//       query.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       query.equalTo("added", true);

//       query.include("asset");
//       query.include("asset.Asset_File");
//       query.include("asset.Key_Image");
//       query.include("asset.userOwner");

//       const results = await query.find({ useMasterKey: true });
//       const lst = [];

//       for (const invAsset of results) {
//         const asset = mapAsset(invAsset.get("asset"));
//         lst.push({ ...asset, added: invAsset.get("added") });
//       }

//       return { result: lst, status: "success" };
//     } catch (error) {
//       return handleError("/inventory", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "asset",
//   async (request) => {
//     try {
//       let { assetId } = request.params;
//       const { user } = request;

//       const query = new Parse.Query(models.assets);
//       query.equalTo("objectId", assetId);
//       query.equalTo("t__status", "Published");
//       query.include("Asset_File");
//       query.include("Key_Image");
//       query.include("userOwner");
//       query.include(["Worlds"]);
//       query.include(["Author"]);
//       query.include(["Categories"]);
//       query.include(["Metadata"]);
//       query.include(["Usage"]);

//       const query1 = new Parse.Query(models.inventory);
//       query1.equalTo("asset", {
//         objectId: assetId,
//         __type: "Pointer",
//         className: models.assets,
//       });
//       query1.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       const result = await query.first({ useMasterKey: true });
//       const result1 = await query1.first({ useMasterKey: true });
//       let r = result.toJSON();

//       if (result1) {
//         r.added = result1.get("added") ? result1.get("added") : false;
//       }

//       return { result: r, status: "success" };
//     } catch (error) {
//       return handleError("/asset", error);
//     }
//   },
//   {
//     fields: ["assetId"],
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "inventory-add",
//   async (request) => {
//     try {
//       let { assetId, added } = request.params;
//       const { user } = request;

//       const query = new Parse.Query(models.inventory);
//       query.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       query.equalTo("asset", {
//         objectId: assetId,
//         __type: "Pointer",
//         className: models.assets,
//       });

//       const result = await query.first({ useMasterKey: true });

//       added = !!added;
//       if (result) {
//         result.set("added", added);
//         await result.save();
//       } else {
//         const staredObj = new Parse.Object(models.inventory);
//         staredObj.set("user", {
//           objectId: user.id,
//           __type: "Pointer",
//           className: "_User",
//         });
//         staredObj.set("added", added);
//         staredObj.set("asset", {
//           objectId: assetId,
//           __type: "Pointer",
//           className: models.assets,
//         });
//         await staredObj.save();
//       }

//       return { result: { result: added }, status: "success" };
//     } catch (error) {
//       return handleError("/inventory-add", error);
//     }
//   },
//   {
//     fields: ["assetId", "added"],
//     requireUser: true,
//   }
// );

// // Related with Mural Auth
// Parse.Cloud.define(
//   "linkWith",
//   async (request) => {
//     const { authData, email } = request.params;
//     try {
//       let user;
//       // Check for existing user with email given from `token` request response
//       const userQuery = new Parse.Query("User");
//       userQuery.equalTo("email", email);
//       user = await userQuery.first();
//       const oldId = user ? user.id : null;

//       if (!user) user = new Parse.User();
//       await user.linkWith("mural", { authData }, { useMasterKey: true });

//       // set username and email for the new user
//       if (!oldId) {
//         await user.save(
//           {
//             username: email,
//             email: email,
//           },
//           { useMasterKey: true }
//         );
//       }
//       return { status: "success", result: user };
//     } catch (error) {
//       return handleError("/linkWith", error);
//     }
//   },
//   {
//     fields: ["authData", "email"],
//   }
// );

// // REFACTOR IT
// Parse.Cloud.define("room", async (request) => {
//   try {
//     const query = new Parse.Query(models.room);
//     const query1 = new Parse.Query(models.roomMembers);
//     query.include("world");
//     query.include("creator");
//     query1.include("user");

//     const results = await query.find({ useMasterKey: true });
//     const lst = [];
//     const roomIds = [];

//     for (const room of results) {
//       const roomJson = room.toJSON();
//       lst.push({
//         ...roomJson,
//         creator: mapMuralUser(
//           ["username", "email", "firstName", "lastName", "avatar"],
//           roomJson.creator
//         ),
//       });
//       roomIds.push(roomJson.objectId);
//     }

//     query1.containedIn("room", roomIds);
//     const results1 = await query1.find({ useMasterKey: true });

//     for (const roomM of results1) {
//       const roomMemberJson = roomM.toJSON();
//       const room = lst.find((r) => r.objectId === roomMemberJson.room.objectId);
//       const roomIndex = lst.findIndex(
//         (r) => r.objectId === roomMemberJson.room.objectId
//       );
//       lst[roomIndex].members = room.members ? room.members : [];
//       lst[roomIndex].members.push(
//         mapMuralUser(
//           ["username", "email", "firstName", "lastName", "avatar"],
//           roomMemberJson.user
//         )
//       );
//     }

//     return { status: "success", result: lst };
//   } catch (error) {
//     return handleError("/room", error);
//   }
// });

// Parse.Cloud.define(
//   "roomByCode",
//   async (request) => {
//     const { code } = request.params;
//     try {
//       const result = await findEntities(
//         models.room,
//         {
//           code,
//         },
//         {},
//         ["world", "Key_Image", "creator"],
//         false,
//         true
//       );
//       const roomJson = result.toJSON();
//       roomJson.members = [];
//       roomJson.objects = [];

//       const resultMembers = await findEntities(
//         models.roomMembers,
//         {
//           room: {
//             objectId: roomJson.objectId,
//             __type: "Pointer",
//             className: models.room,
//           },
//         },
//         {},
//         ["user"],
//         true,
//         true
//       );

//       const vrObjects = await findEntities(
//         models.roomObjects,
//         {
//           room: {
//             objectId: roomJson.objectId,
//             __type: "Pointer",
//             className: models.room,
//           },
//         },
//         {},
//         [],
//         true,
//         true
//       );
//       for (const roomM of resultMembers) {
//         roomJson.members.push(
//           mapMuralUser(
//             ["username", "email", "firstName", "lastName", "avatar"],
//             roomM.toJSON().user
//           )
//         );
//       }

//       for (const vrObject of vrObjects) {
//         roomJson.objects.push(vrObject.toJSON());
//       }

//       return roomJson;
//     } catch (error) {
//       return handleError("/roomByCode", error);
//     }
//   },
//   {
//     fields: ["code"],
//   }
// );

// Parse.Cloud.define(
//   "addMember",
//   async (request) => {
//     const { roomId } = request.params;
//     const { user } = request;
//     try {
//       const query = new Parse.Query(models.roomMembers);
//       const query1 = new Parse.Query(models.room);

//       query.equalTo("room", {
//         objectId: roomId,
//         __type: "Pointer",
//         className: models.room,
//       });
//       query.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });

//       query1.include("creator");
//       query1.equalTo("objectId", roomId);

//       const memberResult = await query.first({ useMasterKey: true });
//       const roomResult = await query1.first({ useMasterKey: true });
//       const member = memberResult ? memberResult.toJSON() : undefined;
//       let memberObj;

//       if (!member && roomResult) {
//         const room = roomResult.toJSON();
//         if (room.creator.objectId != user.id) {
//           memberObj = new Parse.Object(models.roomMembers);
//           memberObj.set("user", {
//             objectId: user.id,
//             __type: "Pointer",
//             className: "_User",
//           });
//           memberObj.set("room", {
//             objectId: roomId,
//             __type: "Pointer",
//             className: models.room,
//           });
//           await memberObj.save();
//         }
//       }

//       return { status: "success", result: memberObj || member };
//     } catch (error) {
//       return handleError("/addMember", error);
//     }
//   },
//   {
//     requireUser: true,
//     fields: ["roomId"],
//   }
// );

// Parse.Cloud.define(
//   "removeMember",
//   async (request) => {
//     const { roomId } = request.params;
//     const { user } = request;
//     try {
//       const query = new Parse.Query(models.roomMembers);

//       query.equalTo("room", {
//         objectId: roomId,
//         __type: "Pointer",
//         className: models.room,
//       });
//       query.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });

//       const memberResult = await query.first({ useMasterKey: true });

//       if (memberResult) {
//         await memberResult.destroy();
//       }

//       return { status: "success", result: memberResult };
//     } catch (error) {
//       return handleError("/removeMember", error);
//     }
//   },
//   {
//     requireUser: true,
//     fields: ["roomId"],
//   }
// );

// Parse.Cloud.define(
//   "roomByMuralUser",
//   async (request) => {
//     const { email } = request.params;
//     try {
//       const userRes = await findEntities(
//         "User",
//         {
//           username: email,
//         },
//         {},
//         [],
//         false,
//         true
//       );
//       if (!userRes) {
//         return [];
//       }
//       const [roomMembers, roomsRes] = await Promise.all([
//         findEntities(
//           models.roomMembers,
//           {
//             user: {
//               objectId: userRes._getId(),
//               __type: "Pointer",
//               className: "_User",
//             },
//           },
//           {},
//           ["room"],
//           true,
//           true
//         ),
//         findEntities(
//           models.room,
//           {
//             creator: {
//               objectId: userRes._getId(),
//               __type: "Pointer",
//               className: "_User",
//             },
//           },
//           {},
//           [],
//           true,
//           true
//         ),
//       ]);

//       const rooms = [];

//       for (const room of roomMembers) {
//         const roomObj = room.get("room");
//         let r;
//         if (roomObj) {
//           r = roomObj.toJSON();
//           rooms.push({ id: r.objectId, name: r.name });
//         } else {
//           console.log(room, "broken roommember obj");
//         }
//       }

//       for (const room of roomsRes) {
//         const rObj = {
//           id: room._getId(),
//           name: room.get("name"),
//         };
//         if (!rooms.find((r) => r.id === rObj.id)) {
//           rooms.push(rObj);
//         }
//       }

//       return rooms;
//     } catch (error) {
//       return handleError("/roomByMuralUser", error);
//     }
//   },
//   {
//     fields: ["email"],
//   }
// );

// Parse.Cloud.define(
//   "roomByUser",
//   async (request) => {
//     const { user } = request;
//     try {
//       const query1 = new Parse.Query(models.roomMembers);
//       const query2 = new Parse.Query(models.room);

//       query1.include("room");
//       query1.include("room.creator");
//       query1.include("room.world");
//       query1.include("room.world.Key_Image");

//       query2.include("creator");
//       query2.include("world");
//       query2.include("world.Key_Image");

//       query1.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       query2.equalTo("creator", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       const roomsRes = await query1.find({ useMasterKey: true });
//       const roomsRes1 = await query2.find({ useMasterKey: true });

//       const rooms = [];

//       for (const roomMember of roomsRes) {
//         const room = roomMember.get("room");
//         const roomMemberObj = roomMember.toJSON();
//         const r = { ...roomMemberObj.room };
//         let img = {};

//         if (room) {
//           r["id"] = room._getId();
//         } else {
//           console.log(roomMemberObj.objectId, "broken room member");
//           continue;
//         }

//         if (r.world) {
//           if (r.world.Key_Image) {
//             img = r.world.Key_Image.file;
//           }
//           r.world = { name: r.world.Name, img };
//         } else {
//           console.log(r.id, "broken world");
//           continue;
//         }

//         if (r.creator) {
//           r.creator = mapMuralUser(
//             ["username", "email", "firstName", "lastName", "avatar"],
//             r.creator
//           );
//         } else {
//           console.log(r.id, "broken creator");
//           continue;
//         }
//         rooms.push(r);
//       }

//       for (const room of roomsRes1) {
//         const roomObj = room.toJSON();
//         let img = {};
//         const rObj = { id: room._getId(), ...roomObj };
//         if (!rooms.find((r) => r.id === rObj.id)) {
//           if (rObj.world) {
//             if (rObj.world.Key_Image) {
//               img = rObj.world.Key_Image.file;
//             }

//             rObj.world = { name: rObj.world.Name, img };
//           } else {
//             console.log(rObj.id, "broken world");
//             continue;
//           }
//           if (rObj.creator) {
//             rObj.creator = mapMuralUser(
//               ["username", "email", "firstName", "lastName", "avatar"],
//               rObj.creator
//             );
//           } else {
//             console.log(rObj.id, "broken creator");
//             continue;
//           }
//           rooms.push(rObj);
//         }
//       }

//       return { status: "success", result: rooms };
//     } catch (error) {
//       return handleError("/roomByUser", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "star-room",
//   async (request) => {
//     const { user } = request;
//     let { roomId, stared } = request.params;

//     const query = new Parse.Query(models.staredRooms);
//     query.equalTo("user", {
//       objectId: user.id,
//       __type: "Pointer",
//       className: "_User",
//     });
//     query.equalTo("room", {
//       objectId: roomId,
//       __type: "Pointer",
//       className: models.room,
//     });

//     const result = await query.first({ useMasterKey: true });

//     stared = !!stared;
//     if (result) {
//       result.set("stared", !stared);
//       await result.save();
//     } else {
//       const staredObj = new Parse.Object(models.staredRooms);
//       staredObj.set("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       staredObj.set("stared", !stared);
//       staredObj.set("room", {
//         objectId: roomId,
//         __type: "Pointer",
//         className: models.room,
//       });
//       await staredObj.save();
//     }

//     return { result: { result: stared }, status: "success" };
//   },
//   {
//     fields: ["roomId", "stared"],
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "stared-rooms",
//   async (request) => {
//     try {
//       const { user } = request;
//       const { populate } = request.params;

//       const query = new Parse.Query(models.staredRooms);
//       query.equalTo("user", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });
//       query.equalTo("stared", true);

//       if (populate) {
//         query.include("room.world");
//         query.include("room.creator");
//         query.include("room.world.Key_Image");
//       }

//       const results = await query.find({ useMasterKey: true });
//       const lst = [];

//       for (const staredAsset of results) {
//         let room = staredAsset.get("room").toJSON();
//         if (!populate) {
//           lst.push(room.objectId);
//         } else {
//           let world = { name: "Removed World", img: "" };
//           if (room.world) {
//             world = {
//               name: room.world.Name,
//               img: room.world.Key_Image ? room.world.Key_Image.file : "",
//             };
//           }
//           room.world = world;
//           room.creator = mapMuralUser(
//             ["username", "email", "firstName", "lastName", "avatar"],
//             room.creator
//           );
//           lst.push(room);
//         }
//       }

//       return { result: lst, status: "success" };
//     } catch (error) {
//       return handleError("/stared-rooms", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "roomById",
//   async (request) => {
//     try {
//       let { roomId, excludeFields } = request.params;

//       if (!excludeFields) {
//         excludeFields = [];
//       }

//       const roomObject = await findEntities(
//         models.room,
//         {
//           objectId: roomId,
//         },
//         {},
//         [
//           "world",
//           "creator",
//           "world.Key_Image",
//           ["world.Supported_Activities"],
//           ["world.Locations"],
//         ],
//         false,
//         true
//       );

//       const room = roomObject.toJSON();
//       const img = {};
//       room.creator = mapMuralUser(
//         ["username", "email", "firstName", "lastName", "avatar"],
//         room.creator
//       );

//       if (room.world.Key_Image) {
//         img.name = room.world.Key_Image.file.name;
//         img.url = room.world.Key_Image.file.url;
//       } else {
//         img.name = "";
//         img.url = "";
//       }

//       room.world = {
//         img,
//         name: room.world.Name,
//         locations: room.world.Locations
//           ? room.world.Locations.map((l) => ({ name: l.Name }))
//           : [],
//         supportedActivities: room.world.Supported_Activities
//           ? room.world.Supported_Activities.map((sa) => ({ name: sa.name }))
//           : [],
//       };

//       if (!excludeFields.includes("objects")) {
//         const roomVrObjects = await findEntities(
//           models.roomObjects,
//           {
//             room: {
//               objectId: roomId,
//               __type: "Pointer",
//               className: models.room,
//             },
//           },
//           {},
//           [],
//           true,
//           true,
//           "descending",
//           "updatedAt",
//           10000
//         );
//         room.objects = [];
//         for (const obj of roomVrObjects) {
//           room.objects.push(obj.toJSON());
//         }
//       }

//       if (!excludeFields.includes("members")) {
//         const roomMembers = await findEntities(
//           models.roomMembers,
//           {
//             room: {
//               objectId: roomId,
//               __type: "Pointer",
//               className: models.room,
//             },
//           },
//           {},
//           ["user"],
//           true,
//           true
//         );
//         room.members = [];
//         for (const roomMember of roomMembers) {
//           const member = roomMember.toJSON();
//           room.members.push(
//             mapMuralUser(
//               ["username", "email", "firstName", "lastName", "avatar"],
//               member.user
//             )
//           );
//         }
//       }

//       if (!excludeFields.includes("deepLinks")) {
//         const deepLinks = await findEntities(
//           models.deepLinks,
//           {
//             vrRoomId: {
//               objectId: roomId,
//               __type: "Pointer",
//               className: models.room,
//             },
//           },
//           {},
//           [],
//           true,
//           true
//         );
//         room.deepLinks = [];
//         for (const deepLink of deepLinks) {
//           room.deepLinks.push(deepLink.toJSON());
//         }
//       }

//       return { result: room, status: "success" };
//     } catch (error) {
//       return handleError("/roomById", error);
//     }
//   },
//   {
//     fields: ["roomId"],
//   }
// );

// Parse.Cloud.define(
//   "removeMemberById",
//   async (request) => {
//     const { roomId, userId } = request.params;
//     const { user } = request;
//     try {
//       // Check if current user is creator
//       const query1 = new Parse.Query(models.room);
//       query1.equalTo("objectId", roomId);
//       query1.equalTo("creator", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });

//       const query = new Parse.Query(models.roomMembers);

//       query.equalTo("room", {
//         objectId: roomId,
//         __type: "Pointer",
//         className: models.room,
//       });
//       query.equalTo("user", {
//         objectId: userId,
//         __type: "Pointer",
//         className: "_User",
//       });

//       const memberResult = await query.first({ useMasterKey: true });
//       const creatorResult = await query1.first({ useMasterKey: true });

//       if (memberResult && creatorResult) {
//         await memberResult.destroy();
//         return { status: "success", result: memberResult };
//       } else {
//         return { status: "error", result: {} };
//       }
//     } catch (error) {
//       return handleError("/removeMemberById", error);
//     }
//   },
//   {
//     requireUser: true,
//     fields: ["roomId", "userId"],
//   }
// );

// Parse.Cloud.define(
//   "addMemberById",
//   async (request) => {
//     const { roomId, userId } = request.params;
//     const { user } = request;
//     try {
//       // Check if current user is creator
//       const query1 = new Parse.Query(models.room);
//       query1.equalTo("objectId", roomId);
//       query1.equalTo("creator", {
//         objectId: user.id,
//         __type: "Pointer",
//         className: "_User",
//       });

//       const query = new Parse.Query(models.roomMembers);

//       query.equalTo("room", {
//         objectId: roomId,
//         __type: "Pointer",
//         className: models.room,
//       });
//       query.equalTo("user", {
//         objectId: userId,
//         __type: "Pointer",
//         className: "_User",
//       });

//       const memberResult = await query.first({ useMasterKey: true });
//       const creatorResult = await query1.first({ useMasterKey: true });
//       let memberObj;

//       if (!memberResult && creatorResult && userId != user.id) {
//         memberObj = new Parse.Object(models.roomMembers);
//         memberObj.set("user", {
//           objectId: userId,
//           __type: "Pointer",
//           className: "_User",
//         });
//         memberObj.set("room", {
//           objectId: roomId,
//           __type: "Pointer",
//           className: models.room,
//         });
//         await memberObj.save();
//         return { status: "success", result: memberObj };
//       } else {
//         return { status: "error", result: {} };
//       }
//     } catch (error) {
//       return handleError("/addMemberById", error);
//     }
//   },
//   {
//     requireUser: true,
//     fields: ["roomId", "userId"],
//   }
// );

// Parse.Cloud.define(
//   "muralUsers",
//   async (request) => {
//     const { user } = request;
//     try {
//       const query = new Parse.Query("User");
//       query.notEqualTo("objectId", user.id);
//       query.equalTo("emailVerified", true);
//       query.include("authData");
//       query.limit(100);
//       //query.select(["authData"]);
//       const usersObjects = await query.find({ useMasterKey: true });
//       const users = [];

//       for (const userObj of usersObjects) {
//         const user = userObj.toJSON();
//         if (user.authData) {
//           const muralUser = mapMuralUser(["firstName", "lastName"], user);
//           muralUser.userName = muralUser.firstName + " " + muralUser.lastName;
//           muralUser.firstName = undefined;
//           muralUser.lastName = undefined;
//           users.push(muralUser);
//         }
//       }

//       return { status: "success", result: users };
//     } catch (error) {
//       return handleError("/muralUsers", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "worlds",
//   async (request) => {
//     try {
//       const worlds = [];
//       const worldObjects = await findEntities(
//         models.world,
//         {
//           t__status: "Published",
//         },
//         {},
//         [],
//         true,
//         true
//       );

//       for (const worldObj of worldObjects) {
//         const world = worldObj.toJSON();
//         worlds.push({ id: world.objectId, name: world.Name });
//       }

//       return { status: "success", result: worlds };
//     } catch (error) {
//       return handleError("/worlds", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "createRoom",
//   async (request) => {
//     const { user } = request;
//     const { roomModel } = request.params;
//     try {
//       return {
//         status: "success",
//         result: await createVrRoom(roomModel.world, roomModel.name, user.id),
//       };
//     } catch (error) {
//       return handleError("/createRoom", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "uploadFileByUrl",
//   async (request) => {
//     const { url } = request.params;
//     try {
//       const response = await axios.get(url, { responseType: "arraybuffer" });
//       const data = Array.from(Buffer.from(response.data, "binary"));
//       const contentType = response.headers["content-type"];
//       const file = new Parse.File("widget_img", data, contentType);
//       await file.save({ useMasterKey: true });

//       return { status: "success", result: file };
//     } catch (error) {
//       return handleError("/uploadFileByUrl", error);
//     }
//   },
//   {
//     fields: ["url"],
//   }
// );

// Parse.Cloud.define(
//   "createDeepLink",
//   async (request) => {
//     try {
//       await createDeepLinkRecord(request.params);
//       return { status: "success", result: true };
//     } catch (error) {
//       return handleError("/createDeepLink", error);
//     }
//   },
//   {
//     fields: [
//       "roomId",
//       "muralId",
//       "deepLink",
//       "sceneId",
//       "vrRoomId",
//       "muralUrl",
//     ],
//   }
// );

// Parse.Cloud.define("generateDeepLink", async (request) => {
//   const {
//     api_name: apiName,
//     room_id: roomId,
//     mural_host: muralHost,
//     mural_ownerId: ownerId,
//     mural_id: muralId,
//     mural_state: muralState,
//     sceneId,
//     is_facilitator: isFacilitator,
//     vrRoom,
//     isTutorial,
//   } = request.params;

//   try {
//     let muralLink = `${muralHost}/t/${ownerId}/m/${ownerId}/${
//       muralId.split(".")[1]
//     }/${muralState}`;
//     const deeplink = await generateDeeplink({
//       apiName,
//       roomId,
//       muralLink,
//       sceneId,
//       isFacilitator,
//       vrRoom,
//       isTutorial,
//     });
//     return deeplink;
//   } catch (e) {
//     return handleError("/generateDeepLink", e);
//   }
// });

// Parse.Cloud.define(
//   "whitelist",
//   async (request) => {
//     try {
//       const { oculusNameId } = request.params;
//       const user = await findEntities(
//         models.whitelist,
//         {
//           oculusNameId,
//         },
//         {},
//         [],
//         false,
//         true
//       );

//       return { status: "success", result: !!user };
//     } catch (error) {
//       return handleError("/whitelist", error);
//     }
//   },
//   {
//     fields: ["oculusNameId"],
//   }
// );

// Parse.Cloud.define(
//   "getMuralUser",
//   async (request) => {
//     const { userId } = request.params;
//     try {
//       const userRes = await findEntities(
//         "User",
//         {
//           "authData.mural.id": userId,
//         },
//         {},
//         [],
//         false,
//         true
//       );

//       if (!userRes) {
//         return [];
//       }
//       const user = userRes.toJSON();

//       return user;
//     } catch (error) {
//       return handleError("/getMuralUser", error);
//     }
//   },
//   {
//     fields: ["userId"],
//   }
// );

// Parse.Cloud.define(
//   "getUser",
//   async (request) => {
//     const { user } = request;
//     try {
//       const userRes = await findEntities(
//         "User",
//         {
//           objectId: user.id,
//         },
//         {},
//         ["authData"],
//         false,
//         true
//       );

//       const u = userRes.toJSON();

//       return { status: "success", result: u };
//     } catch (error) {
//       return handleError("/getUser", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );
// Parse.Cloud.define("getUserByOculusName", async (request) => {
//   try {
//     const { oculusName } = request.params;
//     const userRes = await findEntities(
//       "User",
//       {
//         oculusName,
//       },
//       {},
//       ["authData"],
//       false,
//       true
//     );
//     const u = userRes.toJSON();
//     delete u.authData;

//     return { status: "success", result: u };
//   } catch (error) {
//     return handleError("/getUserByOculusName", error);
//   }
// });

// Parse.Cloud.define(
//   "roomInfo",
//   async (request) => {
//     try {
//       return {
//         result: await findEntities(
//           models.room,
//           {
//             objectId: request.params.roomId,
//           },
//           {},
//           [],
//           false,
//           true
//         ),
//         status: "success",
//       };
//     } catch (e) {
//       return handleError("/roomInfo", e);
//     }
//   },
//   {
//     fields: ["roomId"],
//   }
// );

// Parse.Cloud.define(
//   "devices",
//   async (request) => {
//     const { user } = request;
//     try {
//       const devices = [];
//       const devicesObjects = await findEntities(
//         models.pairedDevices,
//         {
//           user: {
//             objectId: user.id,
//             __type: "Pointer",
//             className: "_User",
//           },
//         },
//         {},
//         true,
//         true
//       );

//       for (const device of devicesObjects) {
//         const deviceTmp = device.toJSON();
//         devices.push(deviceTmp);
//       }

//       return { status: "success", result: devices };
//     } catch (error) {
//       return handleError("/devices", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );

// Parse.Cloud.define(
//   "isDevEnabled",
//   async (request) => {
//     try {
//       const user = await findEntities(
//         models.whitelist,
//         {
//           oculusNameId: request.params.oculusNameId,
//         },
//         {},
//         [],
//         false,
//         true
//       );
//       return {
//         status: "success",
//         result: user ? user.get("isDevEnabled") : false,
//       };
//     } catch (error) {
//       return handleError("/isDevEnabled", error);
//     }
//   },
//   {
//     fields: ["oculusNameId"],
//   }
// );

// Parse.Cloud.define(
//   "getLinkByCode",
//   async (request) => {
//     const { code } = request.params;
//     try {
//       const link = await findEntities(models.deepLinks, {
//         code,
//       });
//       if (!link) {
//         return { status: "error", error: "Can't find room" };
//       }

//       return { status: "success", result: link };
//     } catch (error) {
//       return handleError("/getLinkByCode", error);
//     }
//   },
//   {
//     fields: ["code"],
//   }
// );

// Parse.Cloud.define(
//   "setDevMode",
//   async (request) => {
//     const { user } = request;
//     const { mode } = request.params;
//     try {
//       const userData = await findEntities("User", {
//         objectId: user.toJSON().objectId,
//       });
//       const link = await findEntities(models.whitelist, {
//         oculusNameId: userData.toJSON().oculusName,
//       });
//       if (!link) {
//         return { status: "error", error: "Can't find whitelist object" };
//       } else {
//         link.set("isDevEnabled", mode);
//       }
//       await link.save();
//       return { status: "success", result: mode };
//     } catch (error) {
//       return handleError("/setDevMode", error);
//     }
//   },
//   {
//     fields: ["mode"],
//     requireUser: true,
//   }
// );
// Parse.Cloud.define(
//   "pairDeviceWithMural",
//   async (request) => {
//     const { jwt, ip, location, deviceType, deviceId, oculusName } =
//       request.params;
//     try {
//       const me = await muralInternalMe(jwt);
//       const userObj = await findEntities(
//         "_User",
//         {
//           email: me.email,
//         },
//         {},
//         [],
//         false,
//         true
//       );
//       if (!userObj) {
//         throw new Error("Can't find user with specified email");
//       }
//       const permanentUserId = userObj._getId();
//       const pairedUser = {
//         objectId: permanentUserId,
//         __type: "Pointer",
//         className: "_User",
//       };

//       const pairedDeviceObject = await findEntities(
//         models.pairedDevices,
//         {
//           user: pairedUser,
//           deviceId,
//           oculusName,
//         },
//         {},
//         [],
//         false,
//         true
//       );

//       const pairedDevice = pairedDeviceObject
//         ? pairedDeviceObject
//         : new Parse.Object(models.pairedDevices);
//       pairedDevice.set("user", pairedUser);
//       pairedDevice.set("ip", ip);
//       pairedDevice.set("location", location);
//       pairedDevice.set("deviceType", deviceType);
//       pairedDevice.set("deviceId", deviceId);
//       pairedDevice.set("oculusName", oculusName);
//       pairedDevice.set("sessionId", jwt_decode(jwt).sessionId);

//       const [session] = await Promise.all([
//         findEntities(
//           "_Session",
//           {
//             user: pairedUser,
//           },
//           {},
//           [],
//           false,
//           true
//         ),
//         pairedDevice.save(),
//         moveStuffToPermanentUser(oculusName, permanentUserId),
//         removeTemporaryUsers(permanentUserId, oculusName),
//         userObj.save(
//           { oculusName: oculusName, type: "permanent" },
//           { useMasterKey: true }
//         ),
//       ]);

//       return {
//         status: "success",
//         result: { sessionToken: session.get("sessionToken"), email: me.email },
//       };
//     } catch (error) {
//       return handleError("/pairWithMural", error);
//     }
//   },
//   {
//     fields: ["jwt", "ip", "location", "deviceType", "deviceId", "oculusName"],
//   }
// );

// Parse.Cloud.define(
//   "deeplink",
//   async (request) => {
//     const params = request.params || {};
//     const { OCULUS_APP_ID, OCULUS_ACCESS_TOKEN } = process.env;

//     const { roomId, muralUrl, sceneId, isFacilitator, vrRoom, sut } = params;
//     const messageData = {
//       RoomID: roomId,
//       MuralUrl: muralUrl,
//       SceneID: sceneId,
//       IsFacilitator: isFacilitator,
//       vrRoom,
//       sut,
//     };
//     const message = JSON.stringify(messageData);

//     try {
//       const metaApiUrl = `https://graph.oculus.com/${OCULUS_APP_ID}/app_deeplink_public?access_token=${OCULUS_ACCESS_TOKEN}&destination_api_name=${DEEPLINKS_API_NAME}&valid_for=0&deeplink_message_override=${message}&fields=url`;
//       const { data } = await axios({
//         method: "POST",
//         url: metaApiUrl,
//       });
//       return {
//         status: "success",
//         result: {
//           messageData,
//           url: data.url,
//           id: data.id,
//           debugUrl: metaApiUrl,
//         },
//       };
//     } catch (error) {
//       return handleError("/deeplink", error);
//     }
//   },
//   {
//     fields: ["roomId", "muralUrl", "sceneId", "isFacilitator", "vrRoom"],
//   }
// );

// Parse.Cloud.define("vr-app-info", async (request) => {
//   try {
//     const vrInfoObj = await new Parse.Query(models.vrAppInfo).first();

//     return {
//       status: "success",
//       result: vrInfoObj.toJSON(),
//     };
//   } catch (error) {
//     return handleError("/vr-app-info", error);
//   }
// });

// Parse.Cloud.define(
//   "deeplinkTutorial",
//   async (request) => {
//     const { user } = request;
//     const userJsonObj = user.toJSON();
//     try {
//       // if (userJsonObj.type === "permanent") {
//       //   return {
//       //     status: "error",
//       //     message: "Can't generate tutorial room for permanent user",
//       //   };
//       // }
//       if (!userJsonObj.oculusName) {
//         return {
//           status: "error",
//           message: `Can't find oculus name for userId:${userJsonObj.objectId}`,
//         };
//       }

//       const roomName = `Tutorial Room for ${userJsonObj.oculusName}`;
//       const vrRoom = await findEntities(models.room, {
//         name: roomName,
//         creator: {
//           objectId: userJsonObj.objectId,
//           __type: "Pointer",
//           className: "_User",
//         },
//       });

//       const vrRoomId = vrRoom
//         ? vrRoom._getId()
//         : await createVrRoom(DEFAULT_WORLD_ID, roomName, userJsonObj.objectId);
//       const roomId = `${userJsonObj.oculusName}_tutorial_room`;

//       const existingDeeplink = await findEntities(models.deepLinks, {
//         roomId,
//         vrRoomId: {
//           objectId: vrRoomId,
//           __type: "Pointer",
//           className: models.room,
//         },
//       });

//       const deeplink = existingDeeplink
//         ? existingDeeplink.toJSON()
//         : await generateDeeplink({
//             apiName: DEEPLINKS_API_NAME,
//             roomId,
//             muralLink: DEFAULT_DEEPLINK_URL,
//             sceneId: DEFAULT_SCENE_ID,
//             isFacilitator: 1,
//             vrRoom: vrRoomId,
//             isTutorial: 1,
//           });

//       return {
//         status: "success",
//         result: {
//           code: deeplink.code,
//           vrRoomId,
//           sceneId: deeplink.sceneId,
//         },
//       };
//     } catch (error) {
//       return handleError("/deeplinkTutorial", error);
//     }
//   },
//   {
//     requireUser: true,
//   }
// );