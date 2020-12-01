import {
  get
} from '@ember/object';
import {
  pluralize
} from 'ember-inflector';

/**
 * findNestedRelationship
 *
 * @param {<object>}	record - main resource object
 * @param {<array>}	relationships - array of all included relationships
 * @param {<string>}	path - the string path for the nested relationship
 *
 * @return {<object>}
 */
export default function findNestedRelationship(record, relationships, path) {
  let pathSegments = path.split('.'),
    // property = pathSegments.pop(),
    firstRelationship = pathSegments.shift(),
    // first relationship will be in the data object
    firstRelationshipId = get(record, `relationships.${firstRelationship}.data.id`);

  // access first relationships object from the includes array
  firstRelationship = relationships.find((relationship) => {
    return get(relationship, 'id') === firstRelationshipId && get(relationship, 'type') === pluralize(firstRelationship);
  });

  if (!firstRelationship) {
    return null;
  }

  let currentRelationship = firstRelationship,
    lastRelationship;

  while (pathSegments.length > 0) {

    let nextRelationshipModel = pathSegments.shift(),
      nestedPath = `relationships.${nextRelationshipModel}.data.id`,
      nextRelationshipId = get(currentRelationship, nestedPath);

    if (!nextRelationshipId) {
      break;
    }

    currentRelationship = relationships.find((relationship) => {
      return get(relationship, 'id') === nextRelationshipId && get(relationship, 'type') === pluralize(nextRelationshipModel);
    });

    lastRelationship = currentRelationship;

  }

  if (lastRelationship) {
    return lastRelationship;
  } else {
    return null;
  }
}