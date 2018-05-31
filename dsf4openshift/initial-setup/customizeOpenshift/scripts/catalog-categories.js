/*******************************************************************************
 * Copyright 2015-2018 Capgemini SE.
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************/

// Find the Languages category.
var category = _.find(window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES,
                      { id: 'languages' });
// Add Go as a new subcategory under Languages.
category.subCategories.splice(2,0,{ // Insert at the third spot.
  // Required. Must be unique.
  id: "devonfw-languages",
  // Required.
  label: "DevonFW",
  // Optional. If specified, defines a unique icon for this item.
  icon: "devonfw-logo-language",
  // Required. Items matching any tag will appear in this subcategory.
  tags: [
    "devonfw",
    "devonfw-angular",
    "devonfw-java"
  ]
});

// Add a Featured category as the first category tab.
window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES.unshift({
  // Required. Must be unique.
  id: "devonfw-featured",
  // Required
  label: "DevonFW",
  subCategories: [
    {
      // Required. Must be unique.
      id: "devonfw-languages",
      // Required.
      label: "DevonFW",
      // Optional. If specified, defines a unique icon for this item.
      icon: "devonfw-logo-language",
      // Required. Items matching any tag will appear in this subcategory.
      tags: [
        "devonfw",
        "devonfw-angular",
        "devonfw-java"
      ]
    }
  ]
});
