# Summary

English Deck is as a minimum viable product for an e-learning platform
          built with React. The goal was to create highly interactive articles for
          English learners which included flashcards, a quiz, and a section for
          writing practice and reading submissions from other learners. The
          information from each of these elements is stored and retrieved from
          Firebase on the back-end.

## Technology

The entire app is designed to be a reusable article template, and the
          app itself also contains reusable components. It therefore made sense to
          create the app with React. Using Firebase was also an obvious choice as
          it allows for rapid development both in terms of storage and user
          authentication.

### Challenges and Improvements

Organising the information flow between components was tricky and I
          considered whether I would need to use the Context API in order to avoid
          prop drilling. Ultimately, this wasn’t necessary and the project mainly
          relies on the use of props and the useState and useEffect hooks.
          
I would like to come back to the project and use it as an opportunity to
          learn more about the Firestore data model and NoSQL databases. I think
          this would also be a good opportunity to incorporate React Router and
          scale the app into a site which can easily be updated with more
          interactive articles which follow the same template.

### Lessons Learned

Despite the relatively small scale of the project, the integration of a
          number of distinct components required considerable thought for
          organisation. This was especially true in relation to managing the flow
          of information between parent and child components in React.
  
     
The project was large enough in scale to allow me to deepen my
          understanding of React Hooks, and I’m looking forward to working on
          something which will allow me to work more with other elements of React,
          such as the Context API and Custom Hooks.
      
Working with React and Firebase was also an excellent chance to practice
          more with asynchronous JavaScript and introduced a new set of challenges
          (and a new set of error codes!), which gave me a deeper understanding of
          asynchronicity, callback functions and promises.
      

