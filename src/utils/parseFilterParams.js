
const parseContactType = (type) => {
  const isString = typeof type === 'string';

  if (!isString) return;

  const types = ['work', 'home', 'personal'];

  if (types.includes(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  const isBoolean = typeof isFavourite === 'boolean';

  if (isBoolean) return isFavourite;

  if (isString) {
    if (isFavourite.toLowerCase() === 'true') return true;
    if (isFavourite.toLowerCase() === 'false') return false;
  }
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};

