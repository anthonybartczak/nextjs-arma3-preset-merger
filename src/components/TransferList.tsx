"use client"

import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

function not(a: readonly PresetObject[], b: readonly PresetObject[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly PresetObject[], b: readonly PresetObject[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly PresetObject[], b: readonly PresetObject[]) {
  return [...a, ...not(b, a)];
}

interface PresetObject {
  displayName: string;
  addonId: string;
  source: string;
  link: string;
}

interface SelectAllTransferListProps {
  primaryContent: PresetObject[];
  secondaryContent: PresetObject[];
}

const testObject = [
  {
    "displayName": "CBA_A3",
    "addonId": "450814997",
    "source": "Steam",
    "link": "https://steamcommunity.com/sharedfiles/filedetails/?id=450814997"
  },
  {
    "displayName": "RKSL Studios - Attachments v3.02",
    "addonId": "1661066023",
    "source": "Steam",
    "link": "https://steamcommunity.com/sharedfiles/filedetails/?id=1661066023"
  },
]

export default function SelectAllTransferList({primaryContent, secondaryContent}: SelectAllTransferListProps) {

  const [checked, setChecked] = React.useState<PresetObject[]>([]);
  const [left, setLeft] = React.useState<PresetObject[]>(primaryContent);
  const [right, setRight] = React.useState<PresetObject[]>(secondaryContent);

  React.useEffect(() => {
    setLeft(primaryContent);
    setRight(secondaryContent);
  }, [primaryContent, secondaryContent]);


  console.log(primaryContent);
  console.log(left);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: PresetObject[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: PresetObject[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: PresetObject[]) => (
    <Card className='rounded-xl bg-neutral-800'>
      <CardHeader
        className='transfer-list-header'
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider className='bg-neutral-800'/>
      <List
        sx={{
          width: 400,
          height: 450,
          overflow: 'auto',
        }}
        className='bg-neutral-900 text-gray-100'
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value["addonId"]}-label`;

          return (
            <ListItem
              key={value["addonId"]}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value["displayName"]} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList('Choices', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Chosen', right)}</Grid>
    </Grid>
  );
}