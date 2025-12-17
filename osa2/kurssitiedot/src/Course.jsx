const Header = ({ course }) => {
    return <h2>{course}</h2>;
  };
  
  const Part = ({ part, exercise }) => {
    return (
      <p>
        {part} {exercise}
      </p>
    );
  };
  
  const Content = ({ parts }) => {
    return (
      <>
        {parts.map((part) => (
          <Part key={part.id} part={part.name} exercise={part.exercises} />
        ))}
      </>
    );
  };
  
  const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)
    return <p><strong>total of {totalExercises} exercises</strong></p>
  };
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    );
  };

export default Course;