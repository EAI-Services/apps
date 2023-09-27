

// // Define a route to add a course
// customCoursesRouter.post('/courses', async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     if (!name || !description ) {
//       return res.status(400).json({ error: 'Name, description, and lessonId are required fields.' });
//     }

//     const newCourse = await prisma.course.create({
//       data: {
//         name,
//         description,
     
//       },
//     });

//     return res.status(201).json(newCourse);
//   } catch (error) {
//     return res.status(500).json({ error: 'An error occurred while creating the course.' });
//   }
// });

// customCoursesRouter.put('/courses', async (req, res) => {
//   try {

//     const updatedCourse = await prisma.course.update({
//         where: {
//           id: courseId,
//         },
//         data: {
//           ...req.body
//         },
//       });

//     return res.status(201).json(updatedCourse);
//   } catch (error) {
//     return res.status(500).json({ error: 'An error occurred while creating the course.' });
//   }
// });

// customCoursesRouter.get('/courses', async (req, res) => {
//     try {
//       const courses = await prisma.course.findMany({ include: {
//         lessons: true, 
//       }});
//       return res.status(200).json(courses);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       return res.status(500).json({ error: 'An error occurred while fetching courses.' });
//     }
//   });
  
//   customCoursesRouter.get('/courses/:id', async (req, res) => {
//     try {
//       const courseId = req.params.id;

//       const course = await prisma.course.findUnique({
//         where: {
//           id: courseId,
//         },
//         include: {
//             lessons: true, 
//           }
//       });
  
//       return res.status(200).json(course);
//     } catch (error) {
//       console.error('Error updating course:', error);
//       return res.status(500).json({ error: 'An error occurred while updating the course.' });
//     }
//   });
  

//   customCoursesRouter.delete('/courses/:id', async (req, res) => {
//     try {
//       const courseId = req.params.id;
  
//       await prisma.course.delete({
//         where: {
//           id: courseId,
//         },
//       });
  
//       return res.status(204).json({message:"course deleted"});
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       return res.status(500).json({ error: 'An error occurred while deleting the course.' });
//     }
//   });
  





  

//  //lesson a
// customCoursesRouter.post('/courses/:id/lesson', async (req, res) => {
//     try {
//       const { name, description } = req.body;
//       const  courseId  = req.params.id;
  
//       if (!name || !description || !courseId) {
//         return res.status(400).json({ error: 'Name, description, and lessonId are required fields.' });
//       }
  
//       const newLesson = await prisma.lesson.create({
//         data: {
//           name,
//           description,
//           courseId
//         },
//       });
  
//       return res.status(201).json(newLesson);
//     } catch (error) {
//       return res.status(500).json({ error: 'An error occurred while creating the course.' });
//     }
//   });
  
//   customCoursesRouter.put('/lesson/:id', async (req, res) => {
//     try {
//       const  lessonId  = req.params.id;
//       if (!lessonId) {
//         return res.status(400).json({ error: ' lessonId are required fields.' });
//       }
  
//       const updatedCourse = await prisma.lesson.update({
//           where: {
//             id: lessonId,
//           },
//           data: {
//             ...req.body
//           },
//         });
  
//       return res.status(201).json(updatedCourse);
//     } catch (error) {
//       return res.status(500).json({ error: 'An error occurred while creating the course.' });
//     }
//   });
  
//   customCoursesRouter.get('/courses/:id/lesson', async (req, res) => {
//       try {
//         const  courseId  = req.params.id;
//         const lessons = await prisma.lesson.findMany({
//             where:{ courseId},
//             include: {
//             course: true, 
//         }});
//         return res.status(200).json(lessons);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//         return res.status(500).json({ error: 'An error occurred while fetching courses.' });
//       }
//     });
    
//     customCoursesRouter.get('/lesson/:id', async (req, res) => {
//       try {
//         const lessonId = req.params.id;
  
//         const lesson = await prisma.lesson.findUnique({
//           where: {
//             id: lessonId,
//           },
//           include: {
//             course: true, 
//             }
//         });
    
//         return res.status(200).json(lesson);
//       } catch (error) {
//         console.error('Error updating course:', error);
//         return res.status(500).json({ error: 'An error occurred while updating the course.' });
//       }
//     });
    
  
//     customCoursesRouter.delete('/lesson/:id', async (req, res) => {
//       try {
//         const lessonId = req.params.id;
    
//         await prisma.lesson.delete({
//           where: {
//             id:lessonId,
//           },
//         });
    
//         return res.status(204).json({message:"lesson deleted"});
//       } catch (error) {
//         console.error('Error deleting course:', error);
//         return res.status(500).json({ error: 'An error occurred while deleting the course.' });
//       }
//     });
    

