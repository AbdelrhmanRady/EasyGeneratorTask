# Backend

I used Ai to generate the general structure that I planned, and I started by giving a detailed prompt where I already had a general idea of what needs to be done in addition to the description file of the task.

This was my starting prompt:

> I have provided readme file @description.md , it's for a task to implement, let's start slow:
>
> since Front-end is going to use zod let's use it also in backend.
> as for the ORM ( or in our case odm since it's noSql) let's use mongoose.
>
> needless to say we're going to utilize guards for the authentication. and we're not implementing authorization
>
> utilize configServices for the env secrets
>
> for the authorization the first minimal requirement is that it's going to be based on jwt access tokens and refresh tokens.

I've noticed that the model didn't follow my instructions quite much in "needless to say we're going to utilize guards for the authentication", since it used the new @nestjs/authentication first part package, which makes me not have to implement guards and use them on my own (it automatically applies a global guard once attached to the app module), but I've decided to keep it since it proved efficient.

So in conclusion, the first prompt created all the controller,services,modules,types, etc..., basically everything needed to start the app, even though I aimed for a slower more controlled progression initially.

Some mistakes were presented that I changed, for example, the AI put business logic inside a controller, to which I asked:

> why is there business logic inside @auth.controller.ts ?

and it replied by admitting its mistake and changing it

Also it introudced an unreasonable additional layer of complexity, it made a service layer that uses another service layer or acts as a very thin wrapper to it, to which I faced and it did admit it was unreasonable, prompt used was:

> the idea of auth.service and credentials.service seems too much, why not just auth.service? why the extra layer?

After that I used it for writing a docker file and docker compose using the prompt:

> write a Docker file for the application (with node 22), and a composer file that runs our application, and mongo db 8.0, and redis which we'll use later for rate limiting

it was mostly alright although there was some unnecessary complications and wrong assuming that my environment is production.

After that, it was time to integrate with frontend, so I asked the Ai to make a handoff file that the frontend can read and know what to expect (request body, resposnse body, errors), using the prompt:

> create a handoff file for the frontend that contains the endpoints needed to be contacted, with example request bodies and example response bodies

which proved efficient.

I then instructed the Ai to start implementing the logger and gave it as much as detailed explanation as reasonable, using the prompt:

> Now it's time for additional features, let's start with logging, use the built in logger in nest, we wanna focus on three levels, info, warn, error, info is used for operations that are succesful, warn for operations that failed due to client (4xx status) and error for application failure (5xx), the logger should have the following interface:
>
> ```ts
> interface AppLog {
>   operation: string;
>   userId?: string;
>   resourceId?: string;
>   requestId?: string;
>   metadata?: Record<string, unknown>;
> }
> ```
>
> we're gonna need to implement a middleware that generates a random requestId for http request and injects it to request so we can use it.

it did alright initially, but at first it implemented the usage of "import { AsyncLocalStorage } from 'node:async_hooks'" in order to store requestId in memory per request, which seemed useless since we already have a middleware that attachs it to request so I had it removed, also I had it add request body to the logging while redacting sensitive keys.

Then I wanted to implement rate limiting on the endpoints so I used redis and told it to apply a simple approach for ratelimiting using the prompt:

> moving on, let's implement rate limiting, let's keep it simple, just use redis with the combination of ip and number of access, while applying an index on the record so it gets deleted after the time passes, make sure all variables are introduced as env variables

The only issue was redis was applied in a way that prevents future scalable using of it in future modules that would need it, so I instructed it to make it a seperate module on its own with the singleton design pattern.

Then I finalized it by asking to add swagger for the API documenation and also a simple github CI file that runs a code linting check and tests.

And then I finalized the task by asking if it had any comments or different ideas by asking:

> would you say you're satifised with how the features are implemented right now? do you think there's anything too complicated? this isn't a test and I dont want you to agree or disagree, answer with moderation

to which it answered that it didn't and that things were good.

---

# Frontend

I started the initialization of the project with the following prompt:

> Hello, I have provided a @description.md  file with instructions needed for a task, let's start simple by creating the boilerplate and folder structure, give me your best thoughts

thinking it would give me its thoughts and ideas first, but it started on its own doing almost everything needed from the first prompt, and it chose to use a feature-oriented folder structure, which is what I would have chosen too

it did almost everything needed except the connection between frontend and backend, I then provided the handoff produced earlier from the backend to it using prompt:

> I provided a file named @frontend-handoff.md that contains the recent updates from backend that you can use to recoginze the routes you need to call

I scanned the code and found that it used alot of complicated overengineered choices for the network calls, to which I instructed to discard and use axios for more simplicity:

> the use of http.ts seems way too complicated, why not simplify things with axios
>
> You’re right. The custom fetch wrapper was doing work Axios already handles: JSON, status errors, and typed responses.
>
> http.ts is now just a shared client:
>
> ```ts
> export const api = axios.create({
>   baseURL: getApiBaseUrl(),
>   headers: { "Content-Type": "application/json" },
> });
> ```

the frontend part in this task was more straight forward so there wasnt much comments, I then proceeded to ask the same question:

> would you say you're satifised with how the features are implemented right now? do you think there's anything too complicated? this isn't a test and I dont want you to agree or disagree, answer with moderation

to which it answered with changes I discarded like "signInAndRedirect / signUpAndRedirect wrappers also add a hop without much payoff.", which I didnt agree much with, and also comments like:

> " AuthFormResult<T> with casts, and mapping backend "field: message" strings when Zod already covers the same rules on our side."

which I agreed with and changed.