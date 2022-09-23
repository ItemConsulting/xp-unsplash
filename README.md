# CustomSelector with Unsplash images for XP

This application provides a [CustomSelector](https://developer.enonic.com/docs/xp/stable/cms/input-types#customselector) for searching images on [Unsplash](https://unsplash.com/) directly in XP. The application integrates with the [Unsplash API](https://unsplash.com/documentation). You will need an Access Key from Unsplash to make the integration work.

![Jitpack](https://jitpack.io/v/no.item/xp-unsplash.svg)

<img src="https://github.com/ItemConsulting/xp-unsplash/raw/main/src/main/resources/application.svg?sanitize=true" width="150">

## Usage

This application provides a service `unsplash` that can be used with a *CustomSelector* like this:

```xml
<input name="unsplashId" type="CustomSelector">
  <label>Unsplash Image</label>
  <occurrences minimum="1" maximum="1"/>
  <config>
    <service>no.item.unsplash:unsplash</service>
  </config>
</input>
```

You can now search for images on Unsplash right from your custom selector!

## Using the id from the custom selector

The custom selector will save the ID of an image on your content. You can use the following function to get an image url
based on your image ID.

```typescript
import { request } from "/lib/http-client";

const accessKey = "...";

function getUnsplashUrl(imageId: string, width: number, height: number): string {
  const res = request({
    url: `https://api.unsplash.com/photos/${imageId}`,
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });
  
  const rawUrl = JSON.parse(res.body).urls.raw;
  
  return `${rawUrl}?w=${width}&h=${height}`;
}
```

## Development

Make sure to have the [Enonic CLI](https://developer.enonic.com/start) installed.

### Building

To build the project run the following code:

```bash
enonic project build
```

### Deploy locally

Deploy locally for testing purposes:

```bash
enonic project deploy
```
