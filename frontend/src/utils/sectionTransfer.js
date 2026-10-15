/**
 * Demo-only academic section transfer helpers.
 * The Go JSON backend must later implement equivalent validations and
 * coordinated writes so partial updates cannot corrupt records.
 */
export function planStudentMoves(students, className, sourceSection, targetSection) {
  if (!targetSection || sourceSection === targetSection) return [];

  const reservedRolls = new Set(
    students
      .filter(student => student.className === className && student.section === targetSection)
      .map(student => Number(student.roll))
      .filter(roll => Number.isInteger(roll) && roll > 0)
  );

  return students
    .filter(student => student.className === className && student.section === sourceSection)
    .map(student => {
      let roll = Number(student.roll);
      if (!Number.isInteger(roll) || roll < 1 || reservedRolls.has(roll)) {
        roll = 1;
        while (reservedRolls.has(roll)) roll += 1;
      }
      reservedRolls.add(roll);
      return {
        id: student.id,
        name: student.name,
        previousRoll: String(student.roll),
        roll: String(roll),
        section: targetSection,
      };
    });
}

export function planTeacherMoves(teachers, className, sourceSection, targetSection) {
  if (!targetSection || sourceSection === targetSection) return [];

  return teachers.flatMap(teacher => {
    const affected = teacher.assignments.filter(
      assignment => assignment.className === className && assignment.section === sourceSection
    );
    if (!affected.length) return [];

    const assignments = teacher.assignments.map(assignment =>
      assignment.className === className && assignment.section === sourceSection
        ? { ...assignment, section: targetSection }
        : assignment
    );
    // Avoid duplicate teaching assignments if the teacher already teaches
    // the same subject in the destination section.
    const seen = new Set();
    const uniqueAssignments = assignments.filter(assignment => {
      const key = `${assignment.className}|${assignment.section}|${assignment.subjectId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return [{ id: teacher.id, assignments: uniqueAssignments, movedCount: affected.length }];
  });
}
