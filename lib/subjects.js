export const SUBJECT_ORDER = [
  "English",
  "Mizo",
  "Hindi",
  "Social Science",
  "EVS",
  "Science",
  "Mathematics",
  "IT",
  "Moral Values",
  "GK",
  "S & D"
];

export const getSubjectWeight = (subject) => {
  if (!subject) return 999;
  const index = SUBJECT_ORDER.findIndex(s => s.toLowerCase() === subject.toLowerCase());
  return index === -1 ? 999 : index;
};

export const sortClassesBySubject = (classes) => {
  return classes.sort((a, b) => {
    const weightA = getSubjectWeight(a.subject || a);
    const weightB = getSubjectWeight(b.subject || b);
    if (weightA === weightB) {
      // fallback to alphabetical if both are not in list or are the same
      const subA = (a.subject || a || '');
      const subB = (b.subject || b || '');
      return typeof subA === 'string' && typeof subB === 'string' ? subA.localeCompare(subB) : 0;
    }
    return weightA - weightB;
  });
};

export const sortAllClasses = (classes) => {
  return classes.sort((a, b) => {
    // 1. Sort by name
    const nameCmp = (a.name || '').localeCompare(b.name || '');
    if (nameCmp !== 0) return nameCmp;

    // 2. Sort by section
    const secCmp = (a.section || '').localeCompare(b.section || '');
    if (secCmp !== 0) return secCmp;

    // 3. Sort by subject weight
    const weightA = getSubjectWeight(a.subject);
    const weightB = getSubjectWeight(b.subject);
    if (weightA === weightB) {
      return (a.subject || '').localeCompare(b.subject || '');
    }
    return weightA - weightB;
  });
};
